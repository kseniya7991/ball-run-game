varying vec2 vUv;
uniform float uTime;
uniform vec3 uColorDark;
uniform vec3 uColorLight;

#include ../includes/cnoise.glsl; 

void main() {
    vec2 newUv = vec2(vUv.x * 2.0, vUv.y);
    float strength = cnoise(vec3(newUv * 3.0, uTime)) + cnoise(vec3(newUv * 4.0, uTime));

    strength = (strength + 1.2 - step(0.2, strength) * 1.3);
    strength = clamp(strength, 0.0, 1.0);

    vec3 finalColor = mix(uColorLight, uColorDark, strength);
    gl_FragColor = vec4(finalColor, 1.0);
}