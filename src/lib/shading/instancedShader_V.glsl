#define BASIC

#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>

// NOTE <-- Custom defines, uniforms, functions

// per Mesh uniforms
uniform float u_Time_S;
uniform float u_Anim_Length_S;

// per Instance uniforms
uniform vec4 u_Hit_Offset; // xyz: offset values; y: offset strength [0,1]
uniform float u_Hit_Time;

uniform vec3 diffuse;   // via ShaderLib.basic.uniforms

varying vec3 vWorldPosition;
varying vec3 vNormal;

// Custom defines & uniforms -->

void main() {
    #include <uv_vertex>
    #include <color_vertex>
    #include <batching_vertex>
    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>

	#include <begin_vertex>

    //
    // NOTE <-- BEGIN CUSTOM SECTION (VERTEX)

    vec3 myPosition = transformed;
    vec3 myHitOffset = u_Hit_Offset.xyz;
    float myHitOffsetStrength = u_Hit_Offset.w;
    // ^ In

    // anim values [0, 1], start to finish
    float animationProgress = clamp((u_Time_S - u_Hit_Time) / u_Anim_Length_S, 0., 1.);

    vec3 rayHitPosition = myPosition + myHitOffset;
    vec3 rayHitPositionModulated = mix(myPosition, rayHitPosition, myHitOffsetStrength);

    myPosition = mix(rayHitPositionModulated, myPosition, animationProgress);

    // Out \/
    transformed = myPosition;

    // NOTE END CUSTOM SECTION (VERTEX) -->
    //

    #include <project_vertex>
    #include <worldpos_vertex>

    //
    // NOTE <-- BEGIN CUSTOM SECTION (VERTEX)

    vec3 myDiffuse = diffuse;
    vec3 myInstanceVertexColor = vColor;     // per-instance coloring is handled via vColor
    // myPosition = transformed;
    // ^ In

    vec3 rayHighlighted = clamp(myInstanceVertexColor + myDiffuse, 0., 1.);
    vec3 myColor = mix(rayHighlighted, myDiffuse, animationProgress);

    // Pass to Fragment
    vColor = myColor;
    vWorldPosition = worldPosition.xyz;
    vNormal = transformedNormal;

    // NOTE END CUSTOM SECTION (VERTEX) -->
    //

    #include <envmap_vertex>
	#include <fog_vertex>
}
