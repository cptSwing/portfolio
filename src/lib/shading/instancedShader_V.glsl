#define PHONG
varying vec3 vViewPosition;

// WARN keep these here
attribute uint instanceIndex;
uniform highp sampler2D matricesTexture;

#include <common>
#include <color_pars_vertex>
#include <normal_pars_vertex>
#include <shadowmap_pars_vertex>

mat4 getInstancedMatrix() {
    int size = textureSize(matricesTexture, 0).x;
    int j = int(instanceIndex) * 4;
    int x = j % size;
    int y = j / size;
    vec4 v1 = texelFetch(matricesTexture, ivec2(x, y), 0);
    vec4 v2 = texelFetch(matricesTexture, ivec2(x + 1, y), 0);
    vec4 v3 = texelFetch(matricesTexture, ivec2(x + 2, y), 0);
    vec4 v4 = texelFetch(matricesTexture, ivec2(x + 3, y), 0);
    return mat4(v1, v2, v3, v4);
}

#define RAYHIT_OFFSET 0.05
#define TIMESPAN 2000.

uniform float u_Time_Ms;
uniform vec2 u_Hit;

varying vec3 v_Instance_Color;
varying vec3 v_World_Position;
varying float v_Anim_Progress;

void main() {
    // WARN keep this here
    mat4 instanceMatrix = getInstancedMatrix();

    #include <color_vertex>
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    #include <normal_vertex>
    #include <begin_vertex>

    // <-- CUSTOM SECTION (VERTEX)

    float timeHitMs = u_Hit.x;
    v_Anim_Progress = clamp((u_Time_Ms - timeHitMs) / TIMESPAN, 0., 1.);

    float offsetZ = RAYHIT_OFFSET * u_Hit.y;
    transformed.z = mix(offsetZ, transformed.z, v_Anim_Progress);

    vec4 worldPosition = instanceMatrix * vec4(transformed, 1.0);
    v_World_Position = worldPosition.xyz;
    v_Instance_Color = getColorTexture();

    // CUSTOM SECTION (VERTEX) -->

    #include <project_vertex>

    vViewPosition = -mvPosition.xyz;

    #include <shadowmap_vertex>

}
