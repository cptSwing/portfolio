#define BASIC

uniform vec3 diffuse;
uniform float opacity;

#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>

// NOTE <-- Custom defines, uniforms, functions

float remap(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

// per Mesh uniforms
uniform float u_Length;

varying vec3 vWorldPosition;
// varying vec3 vNormal;

// Custom defines & uniforms -->

void main() {
    vec4 diffuseColor = vec4(diffuse, opacity);

    #include <specularmap_fragment>

    //
    // NOTE <-- BEGIN CUSTOM SECTION (FRAGMENT)

    vec3 myColor = vColor;
    vec2 myUv = vUv;
    vec3 myWorldPosition = vWorldPosition;

    vec3 blackColor = vec3(0.);

    float topHighlightMask = clamp(myUv.x, 0.5, 1.);
    float bottomShadowMask = myUv.y;
    float worldDepth = remap(myWorldPosition.z, -u_Length, u_Length, 0., 1.);

    vec3 fakeDepth = mix(myColor * blackColor, myColor, worldDepth);
    vec3 fakeHighlight = mix(fakeDepth, myColor * 2., topHighlightMask);
    vec3 fakeShadows = mix(fakeHighlight, blackColor, bottomShadowMask);

    myColor = saturate(fakeShadows);

    // Out \/
    diffuseColor = vec4(myColor, opacity);

    // NOTE END CUSTOM SECTION (FRAGMENT) -->
    //

    ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
    reflectedLight.indirectDiffuse += vec3(1.0);

    reflectedLight.indirectDiffuse *= diffuseColor.rgb;
    vec3 outgoingLight = reflectedLight.indirectDiffuse;

    #include <envmap_fragment>
    #include <opaque_fragment>
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
    #include <fog_fragment>
}
