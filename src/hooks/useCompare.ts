import { usePrevious } from "./usePrevious";

/* Returns `true` if argument's value is different than previously stored value */
export const useCompare = <T>(val: T): boolean => {
    const prevVal = usePrevious(val);
    return val !== prevVal;
};

/* Returns an array of `boolean` values if array element's value is different than previously stored array's element */
export const useCompareArray = <T>(arr: T[] | undefined): boolean[] => {
    const checkArr = arr || [];
    const prevArr = usePrevious<T[]>(checkArr || []) || [];
    return checkArr.map((elem, index) => elem !== prevArr[index]);
};

/**
 * how to use it in useEffect:
 *
 * const Component = (props) => {
 * const hasValChanged = useCompare(val);
 *
 *    useEffect(() => {
 *        console.log('val changed');
 *    }, [hasValChanged])
 *
 *    return <></>
 * }
 */
