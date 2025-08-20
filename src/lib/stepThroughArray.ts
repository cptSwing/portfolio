function stepThroughArray<T>(current: T, direction: 'previous' | 'next' | 'first' | 'last', elements: ReadonlyArray<T>): T {
    const currentIndex = elements.indexOf(current);
    let returnElement = direction === 'first' ? elements.at(0)! : direction === 'last' ? elements.at(-1)! : '___non-assigned'; // not 'null' or 'undefined' since these could be actual elements I guess

    if (returnElement === '___non-assigned') {
        if (direction === 'next') {
            const nextIndex = (currentIndex + elements.length + 1) % elements.length;
            returnElement = elements.at(nextIndex)!;
        } else {
            const previousIndex = (currentIndex + elements.length - 1) % elements.length;
            returnElement = elements.at(previousIndex)!;
        }
    }

    return returnElement as T;
}

export default stepThroughArray;
