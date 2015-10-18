// GLSL textureless classic 3D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-10-11
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//

var pnoise = function() {
	// Takes in a vec3 or vec4
	function mod289(x) {
		var vect = [];
		for (var i = 0; i < x.length; i++)
			vect[i] = x[i] - Math.floor(x[i] * (1.0 / 289.0)) * 289.0;
		return vect;
	}

	// Takes in a vec4
	function permute(x)
	{
		var vect = [];
		for (var i = 0; i < x.length; i++)
			vect[i] = ((x[i] * 34.0) + 1.0) * x[i];
		return mod289(vect);
	}

	// Takes in a return vec4
	function taylorInvSqrt(r)
	{
		var vect = [];
		for (var i = 0; i < r.length; i++)
			vect[i] = 1.79284291400159 - 0.85373472095314 * r[i];
		return vect;
	}

	// Takes in a vec3
	function fade(t) {
		var vect = [];
		for (var i = 0; i < t.length; i++)
			vect[i] = t[i] * t[i] * t[i] * (t[i] * (t[i] * 6.0 - 15.0) + 10.0)
		return vect;
	}

	// function multiply(u, v) {
	// 	return [u[0] * v[0], u[1] * v[1], u[2] * v[2]];
	// }

	function add(u, v) {
		var vect = [];
		for (var i = 0; i < u.length; i++)
			vect[i] = u[i] + v[i];
		return vect;	
	}

	function sub(u, v) {
		var vect = [];
		for (var i = 0; i < u.length; i++)
			vect[i] = u[i] - v[i];
		return vect;	
	}

	function mod (u, v) {
		var vect = [];
		for (var i = 0; i < u.length; i++)
			vect[i] = u[i] % v[i];
		return vect;
	}

	function floor(v) {
		var vect = [];
		for (var i = 0; i < v.length; i++)
			vect[i] = Math.floor(v[i]);
		return vect;
	}

	function fract(v) {
		var vect = [];
		for (var i = 0; i < v.length; i++)
			vect[i] = v[i] - Math.floor(v[i]);
		return vect;
	}

	function mult(v, k) {
		var vect = [];
		for (var i = 0; i < v.length; i++)
			vect[i] = v[i] * k;
		return vect;	
	}

	function multiply(u, v) {
		var vect = [];
		for (var i = 0; i < u.length; i++)
			vect[i] = u[i] * v[i];
		return vect;	
	}

	function abs(v) {
		var vect = [];
		for (var i = 0; i < v.length; i++)
			vect[i] = Math.abs(v[i]);
		return vect;
	}

	function step(u, v) {
		var vect = [];
		for (var i = 0; i < u.length; i++)
			vect[i] = u[i] < v[i] ? 0 : 1;
		return vect;
	}

	function dot(u, v) {
		return u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
	}

	function mix(u, v, a) {
		var vect = [];
		for (var i = 0; i < u.length; i++)
			vect[i] = u[i] * (1 - a) + v[i] * a;
		return vect;
	}

	// Classic Perlin noise, periodic variant
	// Takes vec3 P, vec3 
	// Returns float
	function pnoise(P, rep) {
		var Pi0 = mod(floor(P), rep); // Integer part, modulo period
		var Pi1 = mod(add(Pi0, [1.0, 1.0, 1.0]), rep); // Integer part + 1, mod period
		Pi0 = mod289(Pi0);
		Pi1 = mod289(Pi1);
		var Pf0 = fract(P); // Fractional part for interpolation
		var Pf1 = sub(Pf0, [1.0, 1.0, 1.0]); // Fractional part - 1.0

		var ix = [Pi0[0], Pi1[0], Pi0[0], Pi1[0]];
		var iy = [Pi0[1], Pi0[1], Pi1[1], Pi1[1]];
		var iz0 = [Pi0[2], Pi0[2], Pi0[2], Pi0[2]];
		var iz1 = [Pi1[2], Pi1[2], Pi1[2], Pi1[2]];

		var ixy = permute(add(permute(ix), iy));
		var ixy0 = permute(add(ixy, iz0));
		var ixy1 = permute(add(ixy, iz1));

		var gx0 = mult(ixy0, 1.0 / 7.0);
		var gy0 = sub(fract(mult(floor(gx0), 1.0 / 7.0)), [0.5, 0.5, 0.5, 0.5]);
		gx0 = fract(gx0);
		var gz0 = sub(sub([0.5, 0.5, 0.5, 0.5], abs(gx0)), abs(gy0));
		var sz0 = step(gz0, [0.0, 0.0, 0.0, 0.0]);
		gx0 = sub(gx0, multiply(sz0, sub(step([0.0, 0.0, 0.0, 0.0], gx0), [0.5, 0.5, 0.5, 0.5])));
		gy0 = sub(gy0, multiply(sz0, sub(step([0.0, 0.0, 0.0, 0.0], gy0), [0.5, 0.5, 0.5, 0.5])));

		var gx1 = mult(ixy1, 1.0 / 7.0);
		var gy1 = sub(fract(mult(floor(gx1), 1.0 / 7.0)), [0.5, 0.5, 0.5, 0.5]);
		gx1 = fract(gx1);
		var gz1 = sub(sub([0.5, 0.5, 0.5, 0.5], abs(gx1)), [0.5, 0.5, 0.5, 0.5]);
		var sz1 = step(gz1, [0.0, 0.0, 0.0, 0.0]);
		gx1 = sub(sz1, multiply(sz1, sub(step([0.0, 0.0, 0.0, 0.0], gx1), [0.5, 0.5, 0.5, 0.5])));
		gy1 = sub(sz1, multiply(sz1, sub(step([0.0, 0.0, 0.0, 0.0], gy1), [0.5, 0.5, 0.5, 0.5])));

		var g000 = [gx0[0], gy0[0], gz0[0]];
		var g100 = [gx0[1], gy0[1], gz0[1]];
		var g010 = [gx0[2], gy0[2], gz0[2]];
		var g110 = [gx0[3], gy0[3], gz0[3]];
		var g001 = [gx1[0], gy1[0], gz1[0]];
		var g101 = [gx1[1], gy1[1], gz1[1]];
		var g011 = [gx1[2], gy1[2], gz1[2]];
		var g111 = [gx1[3], gy1[3], gz1[3]];

		var norm0 = taylorInvSqrt([dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)]);
		g000 = mult(g000, norm0[0]);
		g010 = mult(g010, norm0[1]);
		g100 = mult(g100, norm0[2]);
		g110 = mult(g110, norm0[3]);
		var norm1 = taylorInvSqrt([dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)]);
		g001 = mult(g001, norm1[0]);
		g011 = mult(g011, norm1[1]);
		g101 = mult(g101, norm1[2]);
		g111 = mult(g111, norm1[3]);

		var n000 = dot(g000, Pf0);
		var n100 = dot(g100, [Pf1[0], Pf0[1], Pf0[2]]);
		var n010 = dot(g010, [Pf0[0], Pf1[1], Pf0[2]]);
		var n110 = dot(g110, [Pf1[0], Pf1[1], Pf0[2]]);
		var n001 = dot(g001, [Pf0[0], Pf0[1], Pf1[2]]);
		var n101 = dot(g101, [Pf1[0], Pf0[1], Pf1[2]]);
		var n011 = dot(g011, [Pf0[0], Pf1[1], Pf1[2]]);
		var n111 = dot(g111, Pf1);

		var fade_xyz = fade(Pf0);
		var n_z = mix([n000, n100, n010, n110], [n001, n101, n011, n111], fade_xyz[2]);
		var n_yz = mix([n_z[0], n_z[1]], [n_z[2], n_z[3]], fade_xyz[1]);
		var n_xyz = mix([n_yz[0]], [n_yz[1]], fade_xyz[0]);

		return 2.2 * n_xyz;
	}

	function turbulence(p) {
		var w = 100.0;
		var t = -0.5;
		for (var f = 1.0 ; f <= 10.0 ; f++ ) {
			var power = Math.pow( 2.0, f );
			var power_p = mult(p, power)
			t += Math.abs( pnoise(power_p, [10.0, 10.0, 10.0]) / power);
		}
		return t;
	}

	this.deformPoint = function(pos, normal) {
		// Get a turbulent 3d noise using the normal, normal to high freq
		var noise = 10.0 * -0.10 * turbulence(mult(normal, 0.5));
	    // Get a 3d noise using the position, low frequency
	    var b = 5.0 * pnoise(mult(pos, 0.05), [100.0, 100.0, 100.0]);
	    // Compose both noises
	    var displacement = - 10.0 * noise + b;
	    var newPosition = add(pos, mult(normal, displacement));
	    return newPosition;
	}

	var start = Date.now();
	this.deformPointTime = function(pos, normal) {
		var time = .00025 * ( Date.now() - start );
		// Get a turbulent 3d noise using the normal, normal to high freq
		var noise = 10.0 * -0.10 * turbulence(add(mult(normal, 0.5), [time, time, time]));
	    // Get a 3d noise using the position, low frequency
	    var b = 5.0 * pnoise(add(mult(pos, 0.05), mult([time, time, time], 2.0)), [200.0, 200.0, 200.0]);
	    // Compose both noises
	    var displacement = - noise + b;
	    var newPosition = add(pos, mult(normal, displacement));
	    return newPosition;
	}

}