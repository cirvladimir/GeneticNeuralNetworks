var generate_neuron_geo = function(neighbors) {
	var X = 0.525731112119133606;
	var Z = 0.850650808352039932;
	var p_noise = new pnoise();

	var icosahedron_verts = [    
		-X, 0.0, Z, 
		X, 0.0, Z, 
		-X, 0.0, -Z, 
		X, 0.0, -Z,    
		0.0, Z, X, 
		0.0, Z, -X, 
		0.0, -Z, X, 
		0.0, -Z, -X,    
		Z, X, 0.0, 
		-Z, X, 0.0, 
		Z, -X, 0.0, 
		-Z, -X, 0.0
	];

	var icosahedron_faces = [
		0,4,1, 
		0,9,4, 
		9,5,4, 
		4,5,8, 
		4,8,1,    
		8,10,1, 
		8,3,10, 
		5,3,8, 
		5,2,3, 
		2,7,3,    
		7,10,3, 
		7,6,10, 
		7,11,6, 
		11,0,6, 
		0,1,6, 
		6,1,10, 
		9,0,11,
		9,11,2,
		9,2,5, 
		7,2,11
	];

	var UVs = [];

	// For each face, there's three vertices, I want to subdivide these vertices and make new faces.
	// If I subdivide again, I will subdivide these new faces.
	function subdivide(verts, faces, subdivisions) {
		if (subdivisions == 0) return faces;
		// After these vertices are generated, add them to the global array.
		// Then use the indices into the array to create the faces.
		var new_faces = [];
		for (var i = 0; i < faces.length; i += 3) {
			var v1 = [verts[faces[i] * 3], verts[faces[i] * 3 + 1], verts[faces[i] * 3 + 2]];
			var v2 = [verts[faces[i + 1] * 3], verts[faces[i + 1] * 3 + 1], verts[faces[i + 1] * 3 + 2]];
			var v3 = [verts[faces[i + 2] * 3], verts[faces[i + 2] * 3 + 1], verts[faces[i + 2] * 3 + 2]];
			var v1_2 = [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
			var v2_3 = [v2[0] + v3[0], v2[1] + v3[1], v2[2] + v3[2]];
			var v3_1 = [v3[0] + v1[0], v3[1] + v1[1], v3[2] + v1[2]];
			v1_2 = normalize(v1_2);
			v2_3 = normalize(v2_3);
			v3_1 = normalize(v3_1);
			// Add the vertices
			var index_v1_2 = verts.length / 3;
			verts.push(v1_2[0]);
			verts.push(v1_2[1]);
			verts.push(v1_2[2]);
			var index_v2_3 = verts.length / 3;
			verts.push(v2_3[0]);
			verts.push(v2_3[1]);
			verts.push(v2_3[2]);
			var index_v3_1 = verts.length / 3;
			verts.push(v3_1[0]);
			verts.push(v3_1[1]);
			verts.push(v3_1[2]);
			// Add the faces
			new_faces.push(faces[i], index_v1_2, index_v3_1);
			new_faces.push(faces[i + 1], index_v2_3, index_v1_2);
			new_faces.push(faces[i + 2], index_v3_1, index_v2_3);
			new_faces.push(index_v1_2, index_v2_3, index_v3_1);
		}
		return subdivide(verts, new_faces, subdivisions - 1);
	}

	function computeSphereUVs(verts) {
		var UVs = [];
		for (var i = 0; i < verts.length; i += 3) {
			var d = [0 - verts[i], 0 - verts[i + 1], verts[i + 2]]; // This way it is shaded consistently with the regular sphere
			d = normalize(d);
			var u = 0.5 + Math.atan2(d[2], d[0]) / (2 * Math.PI);
			var v = 0.5 - Math.asin(d[1]) / Math.PI;
			UVs.push(u);
			UVs.push(v);
		}
		return UVs;
	}

	function normalize(v) {
		var mag = magnitude(v);
		return [v[0] / mag, v[1] / mag, v[2] / mag];
	}

	function magnitude(v) {
		return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	}

	function dotProduct(u, v) {
		return u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
	}

	function sub(u, v) {
		var vect = [];
		for (var i = 0; i < u.length; i++)
			vect[i] = u[i] - v[i];
		return vect;	
	}

	function mult(v, k) {
		var vect = [];
		for (var i = 0; i < v.length; i++)
			vect[i] = v[i] * k;
		return vect;	
	}

	icosahedron_faces = subdivide(icosahedron_verts, icosahedron_faces, 3);
	UVs = computeSphereUVs(icosahedron_verts);

	/// Example of adding edges
	var vectors_to_neighbors = neighbors.vectors;

	// Faces are not in the right CCW order - so we need to account for that
	var icosahedron_geo = new THREE.Geometry();
	for (var i = 0; i < icosahedron_verts.length; i += 3) {
		var position = [icosahedron_verts[i] * 20, icosahedron_verts[i+1] * 20, icosahedron_verts[i+2] * 20];
		var normal = normalize(position);

	    var newPosition = p_noise.deformPoint(position, normal);
	    // var newPosition = p_noise.deformPointTime(position, normal);

		// Edge attraction
		for (var j = 0; j < vectors_to_neighbors.length; j++) {
			var vector_to_neighbor_unnormalized = vectors_to_neighbors[j];
			var distance_to_neighbor = magnitude(vector_to_neighbor_unnormalized);
			var vector_to_neighbor_normalized = normalize(vector_to_neighbor_unnormalized);

			var vertex_to_neighbor = sub(mult(vector_to_neighbor_normalized, 20), position);
			var test_vector = normalize(sub(vector_to_neighbor_unnormalized, position));
			test_vector = vector_to_neighbor_normalized;
			var angle = Math.acos(dotProduct(normalize(vertex_to_neighbor), vector_to_neighbor_normalized)) * 180 / Math.PI;
			if (angle > 85.0) {
				var scale = (90.0 - angle) / 5.0;
				newPosition[0] = newPosition[0] + test_vector[0] * distance_to_neighbor;
				newPosition[1] = newPosition[1] + test_vector[1] * distance_to_neighbor;
				newPosition[2] = newPosition[2] + test_vector[2] * distance_to_neighbor;
			}
		}

		icosahedron_geo.vertices.push(new THREE.Vector3(newPosition[0], newPosition[1], newPosition[2]));
	}

	for (var i = 0; i < icosahedron_faces.length; i += 3) {
		icosahedron_geo.faces.push(new THREE.Face3(icosahedron_faces[i], icosahedron_faces[i+2], icosahedron_faces[i+1]));
	}

	for (var i = 0; i < icosahedron_faces.length; i += 3) {
		var faceUVs = [
			new THREE.Vector2(UVs[icosahedron_faces[i] * 2], UVs[icosahedron_faces[i] * 2 + 1]),
			new THREE.Vector2(UVs[icosahedron_faces[i + 2] * 2], UVs[icosahedron_faces[i + 2] * 2 + 1]),
			new THREE.Vector2(UVs[icosahedron_faces[i + 1] * 2], UVs[icosahedron_faces[i + 1] * 2 + 1])
		];
		icosahedron_geo.faceVertexUvs[0].push(faceUVs);
	}

	icosahedron_geo.mergeVertices();
	icosahedron_geo.computeFaceNormals();
	icosahedron_geo.computeVertexNormals();

	return icosahedron_geo;
}