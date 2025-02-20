#define PHONG

uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;

#include <common>
#include <packing>
// #include <dithering_pars_fragment>
#include <color_pars_fragment>

#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>

uniform vec2 u_Hit;
uniform vec3 u_Hit_Color;

varying vec3 v_Instance_Color;
varying float v_Anim_Progress;

float remap(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
    vec4 diffuseColor = vec4(diffuse, opacity);

    ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
    vec3 totalEmissiveRadiance = emissive;

    #include <color_fragment>

    // <-- CUSTOM SECTION (FRAGMENT)

    vec3 offsetColor = u_Hit_Color * vec3(u_Hit.y);
    // diffuseColor.rgb = mix(v_Instance_Color + offsetColor, v_Instance_Color, v_Anim_Progress);
    diffuseColor.rgb = u_Hit_Color;

    // CUSTOM SECTION (FRAGMENT) -->

    #include <alphatest_fragment>
    #include <alphahash_fragment>
    #include <specularmap_fragment>
    #include <normal_fragment_begin>

    #include <lights_phong_fragment>
    #include <lights_fragment_begin>
    #include <lights_fragment_end>

    vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;

    #include <opaque_fragment>
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
