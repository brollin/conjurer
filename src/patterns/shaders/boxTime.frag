#include <conjurer_common>

#ifdef GL_ES
precision mediump float;
#endif

varying vec2 v_uv;
uniform float u_time;

uniform Palette u_palette;

// #define u_palette Palette(vec3(0.5774455613585161, 0.918901534803475, 0.9183302614725621), vec3(0.8214304234785681, 0.5104221980835277, 0.08214322007047792), vec3(0.711588398332782, 0.871542869224424, 0.5801340330878866), vec3(0.7204852048004471, 0.45233742857529746, 0.12917934855128466))

const float NUM_OF_STEPS = 128.0;
const float MIN_DIST_TO_SDF = 0.001;
const float MAX_DIST_TO_TRAVEL = 512.0;

float opSmoothUnion(float d1, float d2, float k) {
    float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
    return mix(d2, d1, h) - k * h * (1.0 - h);
}

float sdfPlane(vec3 p, vec3 n, float h) {
    // n must be normalized
    return dot(p, n) + h;
}

float sdfSphere(vec3 p, vec3 c, float r) {
    return length(p - c) - r;
}

float sdBox(vec3 p, vec3 b) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdRoundBox(vec3 p, vec3 b, float r) {
    vec3 q = abs(p) - b;
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

float map(vec3 p) {
    float radius = 0.75;
    vec3 center = vec3(0.0);
    vec3 q = p;
    float m = MAX_DIST_TO_TRAVEL;

    // part 4 - change height of the sphere based on time
    // center = vec3(0.0, - 0.25 + sin(u_time) * 0.5, 0.0);

    // float sphere = sdfSphere(p, center, radius);
    // m = sphere;

    // // part 1.2 - display plane
    // float h = sin(u_time) + 1.1;
    // // float h = 1.0;

    // vec3 normal = vec3(0.0, 1.0, 0.0);
    // float plane = sdfPlane(p, normal, h);
    // m = min(m, plane);

    q.x += sin(u_time * 2.) + u_time * 2.;
    q.y += cos(u_time * 2.) + u_time * 2.;
    q.z += u_time * 2.;

    // repeats space infinitely every 10 units
    q = mod(q + 5., 10.) - 5.;

    // very box rounding factor over time
    float boxRoundingFactor = sin(u_time * 0.5) * .75 + 0.85;

    // first box
    float box1 = sdRoundBox(q, vec3(0.5), boxRoundingFactor);
    // m = min(m, box1);

    // second box
    // q.x += 0.75 * sin(u_time * 2.2);
    q.y += 1. * sin(u_time * 2.6);
    // q.z += 0.75 * cos(u_time * 2.9);
    float box2 = sdRoundBox(q, vec3(0.5, 0.5, 0.5), boxRoundingFactor);
    // m = min(m, box2);

    // add smooth blending
    // very blending factor over time
    float blendingFactor = sin(u_time * 0.5) * 0.4 + 0.5;
    m = opSmoothUnion(box1, box2, blendingFactor);

    return m;
}

float rayMarch(vec3 ro, vec3 rd, float maxDistToTravel) {
    float dist = 0.0;

    for (float i = 0.0; i < NUM_OF_STEPS; i ++) {
        vec3 currentPos = ro + rd * dist;
        float distToSdf = map(currentPos);

        if (distToSdf < MIN_DIST_TO_SDF) {
            break;
        }

        dist = dist + distToSdf;

        if (dist > maxDistToTravel) {
            break;
        }
    }

    return dist;
}

vec3 getNormal(vec3 p) {
    vec2 d = vec2(0.01, 0.0);
    float gx = map(p + d.xyy) - map(p - d.xyy);
    float gy = map(p + d.yxy) - map(p - d.yxy);
    float gz = map(p + d.yyx) - map(p - d.yyx);
    vec3 normal = vec3(gx, gy, gz);
    return normalize(normal);
}

vec3 render(vec2 uv) {
    vec3 color = vec3(0.0);

    // note: ro -> ray origin, rd -> ray direction
    // ray origin = camera position
    vec3 ro = vec3(0.0, 0.0, - 4.);
    // ray direction = vector from camera position to the current pixel
    vec3 rd = normalize(vec3(uv, 1.0));

    float dist = rayMarch(ro, rd, MAX_DIST_TO_TRAVEL);

    if (dist < MAX_DIST_TO_TRAVEL) {
        // part 1 - display ray marching result
        color = vec3(1.0);

        // part 2.1 - calculate normals
        // calculate normals at the exact point where we hit SDF
        vec3 p = ro + rd * dist;
        vec3 normal = getNormal(p);
        color = normal;

        // part 2.2 - add lighting

        // part 2.2.1 - calculate diffuse lighting
        vec3 lightColor = vec3(1.0);
        // vary the distance of the light source
        vec3 lightSource = vec3(2.5, 2.5, 2.0 - sin(u_time * 0.015) * 5.);
        // vec3 lightSource = vec3(2.5, 2.5, 1.0);
        float diffuseStrength = max(0.0, dot(normalize(lightSource), normal));
        vec3 diffuse = lightColor * diffuseStrength;

        // part 2.2.2 - calculate specular lighting
        vec3 viewSource = normalize(ro);
        vec3 reflectSource = normalize(reflect(- lightSource, normal));
        float specularStrength = max(0.0, dot(viewSource, reflectSource));
        specularStrength = pow(specularStrength, 64.0);
        vec3 specular = specularStrength * lightColor;

        // part 2.2.3 - calculate lighting
        vec3 lighting = diffuse * 0.75 + specular * 0.25;
        color = lighting;

        // part 3 - add shadows

        // part 3.1 - update the ray origin and ray direction
        vec3 lightDirection = normalize(lightSource);
        float distToLightSource = length(lightSource - p);
        ro = p + normal * 0.1;
        rd = lightDirection;

        // part 3.2 - ray march based on new ro + rd
        float dist = rayMarch(ro, rd, distToLightSource);
        if (dist < distToLightSource) {
            color = color * vec3(0.25);
        }

        // note: add gamma correction
        color = pow(color, vec3(1.0 / 2.2));
    }

    vec3 paletteColor = palette((dist / MAX_DIST_TO_TRAVEL) + 0.5 * sin(u_time * 0.1), u_palette);
    color *= paletteColor;

    return color;
}

void main() {
    vec2 uv = v_uv;

    vec3 color = render(uv);

    gl_FragColor = vec4(color, 1.0);
}
