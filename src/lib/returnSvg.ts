const svgs: Record<string, string> = {
    banana: `<svg viewBox="0 0 24 24" id="banana" xmlns="http://www.w3.org/2000/svg"><path id="secondary" d="M4,6V4A1,1,0,0,1,5,3H7A1,1,0,0,1,8,4c0,.6,0,1.38,0,2a9.09,9.09,0,0,0,4,8.08c2,1.31,5,1.57,7,1.59a2,2,0,0,1,2,2h0a2,2,0,0,1-1.16,1.81c-2.69,1.2-9.46,3.44-14.35-1.66C1,13.08,4,6,4,6Z" stroke="none" stroke-width="none" fill="none" /></svg>`,
};

const returnSvg = (svgKey: string, strokeColor: string, strokeWidth: string, fillColor: string) => {
    let svg = svgs[svgKey];
    svg = svg.replace('fill="none"', `fill="${fillColor}"`);
    svg = svg.replace('stroke="none"', `stroke="${strokeColor}"`);
    svg = svg.replace('stroke-width="none"', `stroke-width="${strokeWidth}"`);

    console.log("%c[returnSvg]", "color: #9094b7", `svg :`, svg);

    return svg;
};

export default returnSvg;
