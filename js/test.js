(function() {
	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );



	// var light = new THREE.PointLight( 0xff0000, 1, 100 );
	// light.position.set( 0, 0, 0 );
	// scene.add( light );

	var geometry = new THREE.BoxGeometry( 1, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
	var cube = new THREE.Mesh( geometry, material );
	scene.add( cube );



	var geometry2 = new THREE.CylinderGeometry( 5, 5, 20, 32 );
	var material2 = new THREE.MeshPhongMaterial({color: 0x00ff00} );
	// material2.emissive = 0xffff00;
	// material2.
	var cylinder = new THREE.Mesh( geometry2, material2 );
	scene.add(cylinder);

var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set( 1, 1, 0 );
scene.add( directionalLight );

// var light = new THREE.AmbientLight( 0x404040 ); // soft white light
// scene.add( light );

	camera.position.z = 20;

	function render() {
		cylinder.rotation.x += 3.15;
		// cylinder.rotation.y += 3.15;
		// cylinder.rotation.z += 0.001;
		requestAnimationFrame( render );
		renderer.render( scene, camera );
	}
	render();
})();