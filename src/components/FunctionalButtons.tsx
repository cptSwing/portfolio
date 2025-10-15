import { functionalButtonElements } from '../lib/hexagonElements';
import { FC } from 'react';
import { CategoryName } from '../types/types';
import { FunctionalButton } from './HexagonShapeButtons';

const FunctionalButtons: FC<{ homeMenuTransitionTarget: CategoryName | null }> = ({ homeMenuTransitionTarget }) =>
    functionalButtonElements.map((functionalButtonData, idx) => (
        <FunctionalButton
            key={`hex-functional-button-index-${idx}`}
            buttonData={functionalButtonData}
            homeMenuTransitionTarget={functionalButtonData.name === 'hamburger' ? homeMenuTransitionTarget : undefined}
        />
    ));

export default FunctionalButtons;
