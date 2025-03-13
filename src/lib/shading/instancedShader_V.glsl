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

// per material uniforms
uniform float u_Time_S;
uniform float u_Animation_Length_S;

// per Instance uniforms
uniform float u_Hit_Time_S;
uniform vec3 u_Offset; // xyz: offset values; y: is offset a Hit's offset? 1/0

uniform vec3 diffuse;   // via ShaderLib.basic.uniforms

varying vec3 vPositionW;
varying float vAnimProgress;

#ifdef USE_FRESNEL
// shoehorned in from: https://github.com/otanodesignco/Fresnel-Shader-Material
varying vec3 vViewDirection;
#endif

vec3 getDistanceForEachComponent(vec3 v1, vec3 v2) {
    float xDist = distance(v1.x, v2.x);
    float yDist = distance(v1.y, v2.y);
    float zDist = distance(v1.z, v2.z);
    return vec3(xDist, yDist, zDist);
}

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

    vec3 myHitOffset = u_Offset.xyz;
    // ^ In

    float animationProgress = clamp((u_Time_S - u_Hit_Time_S) / u_Animation_Length_S, 0., 1.);

    vec4 worldPosition = instanceMatrix * modelMatrix * vec4(myPosition, 1.0);

    vec3 currentDistances = getDistanceForEachComponent(myPosition, myPosition + myHitOffset);
    vec3 myOffset = mix(currentDistances, myHitOffset, animationProgress);

    myPosition += myOffset;

    vec3 rayHighlighted = clamp(myInstanceVertexColor + myDiffuse, 0., 1.);
    vec3 myColor = mix(rayHighlighted, myDiffuse, animationProgress);

    // Pass to Fragment
    vColor = myColor;
    vPositionW = worldPosition.xyz;
    vAnimProgress = animationProgress;

    // Out \/
    transformed = myPosition;

    // NOTE END CUSTOM SECTION (VERTEX) -->
    //

	#include <project_vertex>   // mvPosition, gl_Position
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>

    vViewPosition = -mvPosition.xyz;

    #include <worldpos_vertex>

#ifdef USE_FRESNEL
    vViewDirection = normalize(cameraPosition - vec3(worldPosition));
#endif

	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}
