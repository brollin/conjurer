#include <conjurer_common>

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_uv;
uniform float u_time;

uniform Palette u_palette;
uniform float u_timeFactor;
uniform float u_timeOffset;
uniform float u_intensity;
uniform float u_period;

void main() {
    vec3 finalColor = vec3(0.0);
    float b = mix(0.01, 0.2, u_intensity);
    float t = mix(0.01, 2.0, u_timeFactor);
    float p = mix(0.5, 3.0, u_period);
    vec2 uv = v_uv * p;
    float time = u_time + u_timeOffset;
    for (float i = 0.0; i < 2.0; i ++) {
        uv = uv + i;
        uv *= cos(length(uv) - i + time * t) + sin(uv.y);
        uv -= sin(uv + i - time * (t + 0.1)) - cos(uv.y);
        float d = length(uv);
        vec3 col = palette(length(uv) + time, u_palette);
        d = cos(d * 2. + time * t) * .6;
        d = pow(b / d, 1.01);
        finalColor += col * d;
    }
    gl_FragColor = vec4(finalColor, 1.0);
}
