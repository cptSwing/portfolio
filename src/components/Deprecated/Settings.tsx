import { useState } from 'react';
import { usePreviousPersistentArray } from '../../hooks/usePrevious';

const previousVals = [false, false, false];

const Settings = () => {
    const [newVals, setNewVals] = useState<boolean[]>(previousVals);
    const previousRef = usePreviousPersistentArray(newVals);

    return (
        <div id='settings-content'>
            <button className='bg-red-300' onClick={() => setNewVals((newVals) => replaceElementInArray(newVals, !newVals[1], 1))}>
                <h3 className='underline'>Change Value</h3>
                newVals[1]: {newVals ? `${newVals[1]}` : `${typeof newVals}`}
                <br />
                previousRef[1]: {previousRef ? `${previousRef[1]}` : `${typeof previousRef}`}
                <br />
            </button>
            <br />
            <button className='bg-red-300' onClick={() => setNewVals(newVals)}>
                <h3 className='underline'>Don&apos;t Change Value</h3>
                newVals[1]: {newVals ? `${newVals[1]}` : `${typeof newVals}`}
                <br />
                previousRef[1]: {previousRef ? `${previousRef[1]}` : `${typeof previousRef}`}
                <br />
            </button>
        </div>
    );
};

export default Settings;

const replaceElementInArray = <T,>(arr: T[], elem: T, atIndex: number): T[] => {
    const newArr = [...arr];
    newArr.splice(atIndex, 1, elem);
    return newArr;
};
