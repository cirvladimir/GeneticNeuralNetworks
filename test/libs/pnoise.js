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
		vect[i] = ((x[i] * 34.0) + 1.0) * x;
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
		vect[i] = u[0] < v[0] ? 0 : 1;
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
	var sz0 = step(gz0, [0, 0, 0, 0]);
	gx0 -= multiply(sz0, sub(step([0, 0, 0, 0], gx0), [0.5, 0.5, 0.5, 0.5]));
	gy0 -= multiply(sz0, sub(step([0, 0, 0, 0], gy0), [0.5, 0.5, 0.5, 0.5]));

	var gx1 = mult(ixy1, 1.0 / 7.0);
	var gy1 = sub(fract(mult(floor(gx1), 1.0 / 7.0)), [0.5, 0.5, 0.5, 0.5]);
	gx1 = fract(gx1);
	var gz1 = sub(sub([0.5, 0.5, 0.5, 0.5], abs(gx1)), [0.5, 0.5, 0.5, 0.5]);
	var sz1 = step(gz1, [0.0, 0.0, 0.0, 0.0]);

	vec4 gx1 = ixy1 * (1.0 / 7.0);
	vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
	gx1 = fract(gx1);
	vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
	vec4 sz1 = step(gz1, vec4(0.0));
	gx1 -= sz1 * (step(0.0, gx1) - 0.5);
	gy1 -= sz1 * (step(0.0, gy1) - 0.5);

	vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
	vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
	vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
	vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
	vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
	vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
	vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
	vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

	vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
	g000 *= norm0.x;
	g010 *= norm0.y;
	g100 *= norm0.z;
	g110 *= norm0.w;
	vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
	g001 *= norm1.x;
	g011 *= norm1.y;
	g101 *= norm1.z;
	g111 *= norm1.w;

	float n000 = dot(g000, Pf0);
	float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
	float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
	float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
	float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
	float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
	float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
	float n111 = dot(g111, Pf1);

	vec3 fade_xyz = fade(Pf0);
	vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
	vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
	float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
	return 2.2 * n_xyz;
	}

	float turbulence( vec3 p ) {
	float w = 100.0;
	float t = -.5;
	for (float f = 1.0 ; f <= 10.0 ; f++ ){
	float power = pow( 2.0, f );
	t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
	}
	return t;
}
