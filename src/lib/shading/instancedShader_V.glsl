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

#define TIMESPAN 0.25

uniform float u_Time_Seconds;
uniform float u_Time_Last_Hit;
uniform uint u_hitIndex;

varying vec3 v_Color;

void main() {
    // WARN keep this here
    mat4 instanceMatrix = getInstancedMatrix();

    #include <color_vertex>
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    #include <normal_vertex>
    #include <begin_vertex>

    // <-- CUSTOM SECTION (VERTEX)

    float animationProgress = clamp((u_Time_Seconds - u_Time_Last_Hit) / TIMESPAN, 0., 1.);
    // float isStarting = u_hitIndex == instanceIndex ? 1. : 0.;
    // animationProgress = mix(1. - animationProgress, animationProgress, isStarting);

    // vec4 lastColumn = instanceMatrix[3];

    // NOTE instanceIndex is a uint attr provided by InstancedMesh2
    // if (u_hitIndex == instanceIndex) {}

    // lastColumn.z = 0.025 * animationProgress * u_hitWeight;
    // instanceMatrix[3] = lastColumn;

    v_Color = getColorTexture();

    // CUSTOM SECTION (VERTEX) -->

    #include <project_vertex>

    vViewPosition = -mvPosition.xyz;

    #include <worldpos_vertex>
    #include <shadowmap_vertex>

}
