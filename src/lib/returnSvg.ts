const svgs: Record<string, string> = {
    frame: '<svg id="frame" viewBox="0 0 16.425365 10.424603" xmlns="http://www.w3.org/2000/svg"><path id="path" d="M 2.7810174,0.2116671 1.6575267,1.3493365 H 0.2116671 V 9.8923826 L 0.5282263,10.212937 H 12.225061 V 9.3955243 l 0.237417,-0.2404145 h 2.833205 l 0.23742,0.2404145 v 0.8174127 h 0.364035 L 16.213699,9.8923826 V 0.53222181 L 15.897138,0.2116671 Z" stroke="none" stroke-width="none" stroke-linejoin="miter" stroke-miterlimit="1.3" fill="none" /></svg>',
    banana: `<svg viewBox="0 0 48 24" id="banana" xmlns="http://www.w3.org/2000/svg"><path id="secondary" d="M4,6V4A1,1,0,0,1,5,3H7A1,1,0,0,1,8,4c0,.6,0,1.38,0,2a9.09,9.09,0,0,0,4,8.08c2,1.31,5,1.57,7,1.59a2,2,0,0,1,2,2h0a2,2,0,0,1-1.16,1.81c-2.69,1.2-9.46,3.44-14.35-1.66C1,13.08,4,6,4,6Z" stroke="none" stroke-width="none" fill="none" /></svg>`,
};

const returnSvg = (svgKey: string, strokeColor: string, strokeWidth: string, fillColor: string) => {
    let svg = svgs[svgKey];
    svg = svg
        .replace('fill="none"', `fill="${fillColor}"`)
        .replace('stroke="none"', `stroke="${strokeColor}"`)
        .replace('stroke-width="none"', `stroke-width="${strokeWidth}"`);

    console.log("%c[returnSvg]", "color: #9094b7", `svg :`, svg);

    return svg;
};

export default returnSvg;
