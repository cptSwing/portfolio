#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>

// NOTE <-- Custom defines, uniforms, functions

#define FRESNEL_BIAS 0.1
#define FRESNEL_SCALE 1.
#define FRESNEL_POWER 2.

// per Instance uniforms
uniform vec4 u_Hit_Offset; // xyz: offset values; y: offset strength [0,1]
uniform float u_Anim_Progress;

uniform vec3 diffuse;   // via ShaderLib.basic.uniforms

varying vec3 vPositionW;
varying vec3 vNormalW;
varying vec3 vViewDirection;

// Custom defines & uniforms -->

void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>

    //
    // NOTE <-- BEGIN CUSTOM SECTION (VERTEX)
    vec3 myPosition = transformed;
    vec3 myDiffuse = diffuse;
    vec3 myInstanceVertexColor = vColor;     // per-instance coloring is handled via vColor

    vec3 myHitOffset = u_Hit_Offset.xyz;
    float myHitOffsetStrength = u_Hit_Offset.w;
    // ^ In

    vec4 worldPosition = instanceMatrix * modelMatrix * vec4(transformed, 1.0);

    // anim values [0, 1], start to finish
    // float animationProgress = clamp((u_Time_S - u_Hit_Time) / u_Anim_Length_S, 0., 1.);

    vec3 positionOffsetted = (myHitOffset * vec3(myHitOffsetStrength)) + myPosition;
    // myPosition = mix( myPosition,positionOffsetted, u_Anim_Progress);
    myPosition = positionOffsetted;

    vec3 rayHighlighted = clamp(myInstanceVertexColor + myDiffuse, 0., 1.);
    vec3 myColor = mix(rayHighlighted, myDiffuse, u_Anim_Progress);

    vec3 myNormalW = normalize(normalMatrix * transformedNormal);

    // vec3 objectPosition = (modelMatrix * vec4(position, 1.0)).xyz; // object space coordinates
    // vView = normalize(cameraPosition - objectPosition); // view direction in object space
    // vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz); // normalized object space normals

    // Pass to Fragment
    vColor = myColor;
    vPositionW = worldPosition.xyz;
    vNormal = transformedNormal;
    vNormalW = myNormalW; // modelMatrix? * instanceMatrix (no?)

    // Out \/
    transformed = myPosition;

    // NOTE END CUSTOM SECTION (VERTEX) -->
    //

	#include <project_vertex>   // mvPosition, gl_Position
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

    vViewPosition = -mvPosition.xyz;

    #include <worldpos_vertex>

    vViewDirection = normalize(cameraPosition - vec3(worldPosition));

	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}
