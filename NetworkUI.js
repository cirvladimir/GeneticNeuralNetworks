

(function() {
	if ( ! Detector.webgl ) Detector.addGetWebGLMessage();


			var Neuron_Network = {
				vertices: [
					{vertex: "N1", neighbors: [{vertex: "N2", weight: 1}, {vertex: "N3", weight: 2}]},
					{vertex: "N2", neighbors: [{vertex: "N3", weight: 5}, {vertex: "N4", weight: 3}]},
					{vertex: "N3", neighbors: [{vertex: "N4", weight: 3}]},
					{vertex: "N4", neighbors: []}
				]
			};

			var list_lines = [];

			var container, stats;
			var camera, scene, renderer, particles, geometry, material, i, h, color, sprite, size;
			var mouseX = 0, mouseY = 0;

			var windowHalfX = window.innerWidth / 2;
			var windowHalfY = window.innerHeight / 2;

			init();
			animate();

			

			function init() {



				container = document.createElement( 'div' );
				document.body.appendChild( container );

				camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 2, 2000 );
				camera.position.z = 1000;

				scene = new THREE.Scene();
				scene.fog = new THREE.FogExp2( 0x000000, 0.001 );

				geometry = new THREE.Geometry();

				sprite = THREE.ImageUtils.loadTexture( "resources/disc.png" );

				var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
				directionalLight.position.set( 1, 1, 0 );
				scene.add( directionalLight );


				var geometry2 = new THREE.CylinderGeometry( 5, 5, 20, 32 );
				var material2 = new THREE.MeshPhongMaterial({color: 0x00ff00} );
				
				var cylinder = new THREE.Mesh( geometry2, material2 );
				scene.add(cylinder);

				
				var num_neuron = Neuron_Network.vertices.length;
				
				for (var g = 0; g < 100; g++) {


					for ( var i = 0; i < num_neuron; i ++ ) {
						var neuron = Neuron_Network.vertices[i];
						var start_position = {
							x: 2000 * Math.random() - 1000,
							y: 2000 * Math.random() - 1000,
							z: 2000 * Math.random() - 1000
							
						};
						
						var start_vertex = new THREE.Vector3();
						start_vertex.x = start_position.x;
						start_vertex.y = start_position.y;
						start_vertex.z = start_position.z;

						geometry.vertices.push( start_vertex );
						
						var neighbor_size = neuron.neighbors.length;
						for ( var j = 0; j < neighbor_size; j++ ) {

								var weight = neuron.neighbors[j].weight;
								var latitude = generateLongitudeAngle();
								var longitude = generateLatitudeAngle();
								var end_vertex = calculateNewVertex(start_position, latitude, longitude, weight)
								var end_position = createPoint(end_vertex);
								geometry.vertices.push( end_vertex );
								
								
							
						}
					}
				}
				material = new THREE.PointsMaterial( { size: 35, sizeAttenuation: false, map: sprite, alphaTest: 0.5, transparent: true } );
				material.color.setHSL( 1.0, 0.3, 0.7 );

				particles = new THREE.Points( geometry, material );


				scene.add( particles );

				renderer = new THREE.WebGLRenderer();
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth / 2, window.innerHeight / 2 );
				container.appendChild( renderer.domElement );

				//

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );

				//

				document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				windowHalfX = window.innerWidth / 2;
				windowHalfY = window.innerHeight / 2;

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function onDocumentMouseMove( event ) {

				mouseX = event.clientX - windowHalfX;
				mouseY = event.clientY - windowHalfY;

			}

			function onDocumentTouchStart( event ) {

				if ( event.touches.length == 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}
			}

			function onDocumentTouchMove( event ) {

				if ( event.touches.length == 1 ) {

					event.preventDefault();

					mouseX = event.touches[ 0 ].pageX - windowHalfX;
					mouseY = event.touches[ 0 ].pageY - windowHalfY;

				}

			}

			//

			function animate() {

				requestAnimationFrame( animate );

				render();
				stats.update();

			}

			function render() {

				var time = Date.now() * 0.00005;

				camera.position.x += ( mouseX - camera.position.x ) * 0.05;
				camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

				camera.lookAt( scene.position );

				h = ( 360 * ( 1.0 + time ) % 360 ) / 360;
				material.color.setHSL( h, 0.5, 0.5 );

				renderer.render( scene, camera );

			}


			// Return angle in radian
			function generateLatitudeAngle() {
				var angle = ( (Math.random() * 360) * 2 * 3.14 ) / 360;
				return angle;
			}

			function generateLongitudeAngle() {
				var angle = ( (Math.random() * 180 - 90) * 2 * 3.14 ) / 360;
				return angle;
			}

			function calculateNewVertex(start_vertex, latitude, longitude, weight) {
				var end_vertex = new THREE.Vector3();
				var x = weight * Math.cos(longitude) * Math.cos(latitude);
				var y = weight * Math.cos(longitude) * Math.sin(latitude);
				var z = weight * Math.sin(longitude);
				end_vertex.x = x + start_vertex.x;
				end_vertex.y = y + start_vertex.y;
				end_vertex.z = z + start_vertex.z;
				return end_vertex;
			}

			function makeLine() {
				var geometry = new THREE.CylinderGeometry( 5, 5, 20, 32 );
				var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
				var cylinder = new THREE.Mesh( geometry, material );
			}

			function createPoint(vertex) {
				return {
					x: vertex.x,
					y: vertex.y,
					z: vertex.z
				}
			}

})();