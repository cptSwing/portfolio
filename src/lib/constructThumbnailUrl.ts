function constructThumbnailUrl(url: string) {
    const splitStrings = url.split('.');
    return splitStrings[0] + '_thumb.' + splitStrings[1];
}

export default constructThumbnailUrl;
