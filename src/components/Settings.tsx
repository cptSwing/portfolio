import { useEffect, useState } from 'react';
import { usePreviousPersistentArray } from '../hooks/usePrevious';

const previousVals = [false, false, false];

const Settings = () => {
    const [newVals, setNewVals] = useState<boolean[]>(previousVals);
    const { previous: previousRef, hasChanged } = usePreviousPersistentArray(newVals);

    useEffect(() => {
        console.log('%c[Settings]', 'color: #11253c', `useEffect previousRef -> hasChanged, previousRef, newVals:`, hasChanged, previousRef, newVals);
    }, [previousRef]);

    return (
        <div id='settings-content'>
            <button className='bg-red-300' onClick={() => setNewVals((newVals) => [...newVals.slice(0, 1), !newVals[1], ...newVals.slice(2)])}>
                <h3 className='underline'>Change Value</h3>
                newVals[1]: {newVals ? `${newVals[1]}` : `${typeof newVals}`}
                <br />
                hasChanged: {`${hasChanged}`}
            </button>
            <br />
            <button className='bg-red-300' onClick={() => setNewVals((newVals) => [...newVals])}>
                <h3 className='underline'>Don't Change Value</h3>
                newVals[1]: {newVals ? `${newVals[1]}` : `${typeof newVals}`}
                <br />
                hasChanged: {`${hasChanged}`}
            </button>
        </div>
    );
};

export default Settings;
