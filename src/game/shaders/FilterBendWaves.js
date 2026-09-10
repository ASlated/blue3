import { Filters, Renderer } from 'phaser';

const FILTER_NAME = 'FilterBendWaves';

const fragShader = `
// BEND_WAVES_FS
#pragma phaserTemplate(shaderName)

precision mediump float;

uniform float     uTime;
uniform sampler2D uMainSampler;
varying vec2 outTexCoord;


void main( void )
{
    vec3 light = vec3(0.7803921568627451, 0.8274509803921568, 0.9372549019607843);
    vec3 medium = vec3(0.4392156862745098, 0.5843137254901961, 0.9215686274509803);
    vec3 dark = vec3(0.08235294117647059, 0.1450980392156863, 0.29411764705882354);

    vec2 uv = outTexCoord;
    
    vec4 texColorIn = texture2D(uMainSampler, uv);
    vec3 texColorOut;
    if (uTime < .1) {
        texColorOut = vec3(texColorIn[0], texColorIn[1], texColorIn[2]);
    } else if (uTime < .2) {
        if (texColorIn[0] > 0.7) {
            texColorOut = medium;
        } else {
            texColorOut = dark;
        }
    } else {
        texColorOut = dark;
    }
    
    gl_FragColor = vec4(
        texColorOut,
        1.
    );
}
`;

// Boilerplate filter import object.
// Include `FilterBendWaves: BendWaves.Filter` in your game config.
// Use `camera.filters.external.add(new BendWaves.Controller(camera))`
// to add it to a camera.
export default {
    Controller: class ControllerBendWaves extends Filters.Controller
    {
        constructor (camera)
        {
            super(camera, FILTER_NAME);

            this.time = 0;
        }
    },
    Filter: class FilterBendWaves extends Renderer.WebGL.RenderNodes.BaseFilterShader
    {
        constructor (manager)
        {
            super(FILTER_NAME, manager, null, fragShader);
        }

        setupUniforms (controller, drawingContext)
        {
            const programManager = this.programManager;

            controller.time += 0.005;

            programManager.setUniform('uTime', controller.time);
        }
    }
};