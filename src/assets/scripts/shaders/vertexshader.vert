attribute vec3 position;
attribute vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float u_strength;
varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

void main() {
    vUv = uv;

    vec3 pos = position;
    vec2 uvCurve = uv;
    vec3 curve = vec3(
        0.,
        sin( uvCurve.x * PI )  * u_strength,
        0.
    );
    pos += curve * 0.0025;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0 );
}