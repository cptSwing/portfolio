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

// per Instance uniforms
uniform vec4 u_Hit_Offset; // xyz: offset values; y: offset strength [0,1]
uniform float u_Anim_Progress;

uniform vec3 diffuse;   // via ShaderLib.basic.uniforms

varying vec3 vPositionW;

#ifdef USE_FRESNEL
// shoehorned in from: https://github.com/otanodesignco/Fresnel-Shader-Material
varying vec3 vViewDirection;
#endif

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

    vec3 positionOffsetted = myHitOffset * vec3(myHitOffsetStrength);
    myPosition += positionOffsetted;

    vec3 rayHighlighted = clamp(myInstanceVertexColor + myDiffuse, 0., 1.);
    vec3 myColor = mix(rayHighlighted, myDiffuse, u_Anim_Progress);

    vec3 myNormalW = normalize(normalMatrix * transformedNormal);

    // Pass to Fragment
    vColor = myColor;
    vPositionW = worldPosition.xyz;
    // vNormal = transformedNormal;

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
