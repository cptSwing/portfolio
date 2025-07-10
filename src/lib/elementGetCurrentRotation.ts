/* From https://stackoverflow.com/a/54492696 */

const elementGetCurrentRotation = (el: Element) => {
    const style = window.getComputedStyle(el, null);
    const transformMatrix =
        style.getPropertyValue('-webkit-transform') ||
        style.getPropertyValue('-moz-transform') ||
        style.getPropertyValue('-ms-transform') ||
        style.getPropertyValue('-o-transform') ||
        style.getPropertyValue('transform') ||
        'none';

    if (transformMatrix !== 'none') {
        const values = transformMatrix.split('(')[1].split(')')[0].split(',');
        const angle = Math.round(Math.atan2(parseFloat(values[1]), parseFloat(values[0])) * (180 / Math.PI));
        return angle;
    }
    return 0;
};

export default elementGetCurrentRotation;
