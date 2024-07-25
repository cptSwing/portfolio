const svgs: Record<string, Record<string, string>> = {
    frame: {
        svg: '<svg id="frame" viewBox="0 0 16.425365 10.424603" xmlns="http://www.w3.org/2000/svg"><path id="path" d="m 15.808369,0.42250736 0.19327,0.19740436 V 9.805416 l -0.19327,0.195337 H 15.74429 V 9.3093212 L 15.382554,8.9439681 H 12.372913 L 12.011694,9.3093212 V 10.000753 H 0.61495077 L 0.42168053,9.805416 V 1.5614582 H 1.7461502 L 2.869379,0.42333419 Z M 2.6915786,0 1.5683825,1.1371938 H 0.21084026 L 0,1.3485509 V 9.9790491 L 0.43925055,10.424501 H 12.224601 l 0.21084,-0.21084 V 9.4829544 l 0.115239,-0.116789 h 2.656174 l 0.113172,0.116789 v 0.7307066 l 0.212907,0.21084 h 0.451136 L 16.423836,9.9790491 V 0.44627857 L 15.984069,8.2682727e-4 Z" stroke="none" stroke-width="none" stroke-linejoin="miter" stroke-miterlimit="1.3" fill="none" /></svg>',
        svgSlice: "15.5% 27.5% 15.5% 17.75%",
        svgSliceWidth: "5rem 15.5rem 6rem 12.5rem",
    },
    banana: {
        svg: '<svg viewBox="0 0 48 24" id="banana" xmlns="http://www.w3.org/2000/svg"><path id="secondary" d="M4,6V4A1,1,0,0,1,5,3H7A1,1,0,0,1,8,4c0,.6,0,1.38,0,2a9.09,9.09,0,0,0,4,8.08c2,1.31,5,1.57,7,1.59a2,2,0,0,1,2,2h0a2,2,0,0,1-1.16,1.81c-2.69,1.2-9.46,3.44-14.35-1.66C1,13.08,4,6,4,6Z" stroke="none" stroke-width="none" fill="none" /></svg>',
        svgSlice: "",
        svgSliceWidth: "",
    },
};

const returnSvg = (svgKey: string, strokeColor: string, strokeWidth: string, fillColor: string) => {
    const { svg, svgSlice, svgSliceWidth } = svgs[svgKey];
    const svgEdit = svg
        .replace('fill="none"', `fill="${fillColor}"`)
        .replace('stroke="none"', `stroke="${strokeColor}"`)
        .replace('stroke-width="none"', `stroke-width="${strokeWidth}"`);

    return { svg: svgEdit, svgSlice, svgSliceWidth };
};

export default returnSvg;
