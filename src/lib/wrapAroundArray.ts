function wrapAroundArray(currentIndex: number, count: number, direction: 'previous' | 'next') {
    return (currentIndex + count + (direction === 'next' ? 1 : -1)) % count;
}

export default wrapAroundArray;
