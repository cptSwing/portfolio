// Based on https://stackoverflow.com/a/42769683

function convertRemToPixels(remParam: string) {
    let returnRem = remParam;
    if (remParam.includes('rem')) returnRem = remParam.replace('rem', '');
    const remNum = parseFloat(returnRem);

    return remNum * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

export default convertRemToPixels;
