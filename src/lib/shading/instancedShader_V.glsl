#define BASIC
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
// #include <normal_pars_vertex>
#include <shadowmap_pars_vertex>

// <-- Custom defines & uniforms 

// per Mesh uniforms
uniform float u_Time_S;
uniform float u_Anim_Length_S;

// per Instance uniforms
uniform vec4 u_Hit_Offset; // xyz: offset values; y: offset strength [0,1]
uniform vec4 u_Hit_Color;
uniform float u_Hit_Time;

uniform vec3 diffuse;   // via ShaderLib.phong.uniforms

varying vec3 v_Instance_Color;
varying vec4 v_World_Position;
varying vec3 v_Position;
varying float v_Anim_Progress;

// Custom defines & uniforms -->

void main() {
    // WARN <-- keep this here
    mat4 instanceMatrix = getInstancedMatrix();
    // -->

    #include <beginnormal_vertex>
    #include <defaultnormal_vertex>
    // #include <normal_vertex>
    #include <begin_vertex>

    // NOTE <-- BEGIN CUSTOM SECTION (VERTEX)
    vec3 myPosition = transformed;
    // vec3 myDiffuse = diffuse;  // 'diffuse' in phong shader, unused for now
    vec3 myInstanceColor = getColorTexture(); // color-per-instance
    // ^ In

    // Prep Uniforms
    vec3 myHitColor = u_Hit_Color.rgb;
    float myAlpha = u_Hit_Color.a;
    vec3 myHitPositionOffset = u_Hit_Offset.xyz;
    float myHitStrength = u_Hit_Offset.w;

    vec3 myColor;

    // lerp [0, 1]
    float animationProgress = clamp((u_Time_S - u_Hit_Time) / u_Anim_Length_S, 0., 1.);

    vec3 rayHitPosition = myPosition + myHitPositionOffset;
    vec3 rayHitPositionModulated = mix(myPosition, rayHitPosition, myHitStrength);
    myPosition = mix(rayHitPositionModulated, myPosition, animationProgress);

    vec4 myWorldPosition = instanceMatrix * vec4(myPosition, 1.0);

    vec3 myModulatedHitColor = mix(myInstanceColor, myHitColor, myAlpha);
    myColor = mix(myModulatedHitColor, myInstanceColor, animationProgress);

    // Out \/
    v_Instance_Color = myColor; // Pass to Fragment
    v_World_Position = myWorldPosition;
    v_Position = myPosition;
    transformed = myPosition;
    // NOTE END CUSTOM SECTION (VERTEX) -->

    #include <project_vertex>
    vViewPosition = -mvPosition.xyz;
    #include <shadowmap_vertex>
}
