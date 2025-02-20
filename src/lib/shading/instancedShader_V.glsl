#define PHONG
varying vec3 vViewPosition;

// WARN <-- keep these here 
attribute uint instanceIndex;
uniform highp sampler2D matricesTexture;

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
// -->

#include <common>
#include <color_pars_vertex>
#include <normal_pars_vertex>
#include <shadowmap_pars_vertex>

// NOTE <-- Custom defines & uniforms 
#define RAYHIT_OFFSET 0.05
#define TIMESPAN 2000.

uniform float u_Time_Ms;

// x: time of ray-hit; y: strength of ray-hit
uniform vec2 u_Hit;
uniform vec3 u_Hit_Color;

varying vec3 v_Instance_Color;
varying vec4 v_World_Position;
varying float v_Anim_Progress;
// -->

void main() {
    // WARN <-- keep this here
    mat4 instanceMatrix = getInstancedMatrix();
    // -->

    #include <color_vertex>
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    #include <normal_vertex>
    #include <begin_vertex>

    // NOTE <-- BEGIN CUSTOM SECTION (VERTEX)
    vec3 myPosition = transformed;
    vec3 myColor = vColor;
    // ^ In

    float timeHitMs = u_Hit.x;
    float animationProgress = clamp((u_Time_Ms - timeHitMs) / TIMESPAN, 0., 1.);

    float hitStrength = u_Hit.y;
    float offsetZ = RAYHIT_OFFSET * hitStrength;
    myPosition.z = mix(offsetZ, myPosition.z, animationProgress);

    vec3 myInstanceColor = getColorTexture();
    vec3 offsetColor = 2. * u_Hit_Color * vec3(hitStrength);
    myColor = mix(offsetColor, myInstanceColor, animationProgress);
    myColor += vec3(myPosition.z);

    vec4 myWorldPosition = instanceMatrix * vec4(transformed, 1.0);

    // Out \/
    v_Anim_Progress = animationProgress;
    v_World_Position = myWorldPosition;
    v_Instance_Color = myInstanceColor;

    vColor = myColor;
    transformed = myPosition;
    // NOTE END CUSTOM SECTION (VERTEX) -->

    #include <project_vertex>
    vViewPosition = -mvPosition.xyz;
    #include <shadowmap_vertex>
}
