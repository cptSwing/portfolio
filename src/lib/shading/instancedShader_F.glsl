#define BASIC

uniform vec3 diffuse;
uniform float opacity;

#ifndef FLAT_SHADED
varying vec3 vNormal;
#endif

#include <common>
#include <packing>
#include <color_pars_fragment>

float remap(float value, float min1, float max1, float min2, float max2) {
    return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

// NOTE <-- Custom defines & uniforms 
varying vec3 v_Instance_Color;
varying vec4 v_World_Position;
varying vec3 v_Position;
// -->

void main() {
    vec4 diffuseColor = vec4(diffuse, opacity);

    // WARN <-- BEGIN CUSTOM SECTION (FRAGMENT)
    vec4 myDiffuseColor = diffuseColor;
    vec3 myInstanceColor = v_Instance_Color;
    vec3 myPosition = normalize(v_Position);
    vec4 myWorldPosition = normalize(v_World_Position);
    // ^ In

    vec3 myColor;
    float myPosZ = remap(myPosition.z, -1., 1., 0., 1.);
    myColor = myInstanceColor * vec3(myPosZ);

    // Out \/
    diffuseColor = vec4(myColor, opacity);

    // WARN END CUSTOM SECTION (FRAGMENT) -->

    ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));

    #ifdef USE_LIGHTMAP
    vec4 lightMapTexel = texture2D(lightMap, vLightMapUv);
    reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
    reflectedLight.indirectDiffuse += vec3(1.0);
	#endif

    reflectedLight.indirectDiffuse *= diffuseColor.rgb;
    vec3 outgoingLight = reflectedLight.indirectDiffuse;

    #include <opaque_fragment>
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}
