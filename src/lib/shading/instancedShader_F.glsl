#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>

// NOTE <-- Custom defines, uniforms, functions

float remap(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

// per material uniforms
uniform float u_Instance_Width;
uniform vec3 u_Fresnel_Color;

#ifdef USE_FRESNEL
    #define FRESNEL_AMOUNT 3.
    #define FRESNEL_OFFSET 0.05
    #define FRESNEL_INTENSITY 1.
    #define FRESNEL_ALPHA 0.25

float fresnelFunc(float amount, float offset, vec3 normal, vec3 view) {
    return offset + (1.0 - offset) * pow(1.0 - dot(normal, view), amount);
}

varying vec3 vViewDirection;
#endif

varying vec3 vPositionW;
varying float vAnimProgress;

// Custom defines & uniforms -->

void main() {
    vec4 diffuseColor = vec4(diffuse, opacity);
	#include <clipping_planes_fragment>
    ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
    vec3 totalEmissiveRadiance = emissive;
    #include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>

    //
    // NOTE <-- BEGIN CUSTOM SECTION (FRAGMENT)

    vec3 myColor = vColor;
    vec2 myUv = vUv;
    vec3 myWorldPosition = vPositionW;
    float myShininess = shininess;
    float myOpacity = opacity;

    vec3 blackColor = vec3(0.);

    float topHighlightMask = clamp(myUv.x, 0.5, 1.);
    float bottomShadowMask = myUv.y;
    float worldDepth = remap(myWorldPosition.z, -u_Instance_Width, u_Instance_Width, 0., 1.);

    vec3 fakeDepth = mix(myColor * blackColor, myColor, worldDepth);
    vec3 fakeHighlight = mix(fakeDepth, myColor * 1.5, topHighlightMask);
    vec3 fakeShadows = mix(fakeHighlight, blackColor, bottomShadowMask);

    myColor = saturate(fakeShadows);
    myShininess = clamp((1. - vAnimProgress) * 100., 7.5, 100.);
    myOpacity = clamp(myOpacity * vAnimProgress, 0.666, 1.);

#ifdef USE_FRESNEL
    float fresnel = fresnelFunc(FRESNEL_AMOUNT, FRESNEL_OFFSET, vNormal, vViewDirection);
    vec3 fresnelColor = (u_Fresnel_Color * fresnel) * FRESNEL_INTENSITY;
    myColor = mix(myColor, fresnelColor, fresnel * FRESNEL_ALPHA);

    diffuseColor = vec4(myColor, (opacity >= 1.0 ? myOpacity : myOpacity * fresnel));
#else
    diffuseColor = vec4(myColor, myOpacity);
#endif

    // NOTE END CUSTOM SECTION (FRAGMENT) -->
    //

    #include <lights_phong_fragment>
    // ^^^
    material.specularShininess = myShininess;

	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>

    // gl_FragColor = vec4(myColor, 1.);
    // gl_FragColor = vec4(vec3(vNormal.x), 1.);

}
