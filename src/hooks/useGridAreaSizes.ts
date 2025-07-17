/*
Problem: Updating boundingClientRect() on grid areas after their animation is complete, in order to update the svg clipping mask is too late. visible shift of clipping. 
Solution: On Mount of Category, each gridArea's boundingClientRect is pre-calculated and returned via hook, and passed to <SVGClip../> . also add a boolean to force a re-calculation (via resize event for instance)
*/

const useGridAreaSizes = () => {};
