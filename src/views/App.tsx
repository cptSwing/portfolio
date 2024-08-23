import Content from '../components/Content';
import LogoHeader from '../components/LogoHeader';
import Nav, { navWidthClassesChecked, navWidthClassesUnchecked } from '../components/Nav';
import SocialsFooter from '../components/SocialsFooter';
import Background from '../components/Background';
import { useState } from 'react';
import classNames from '../lib/classNames';

const App = () => {
    const [categoryIsChecked, setCategoryIsChecked] = useState<string | null>(null);

    return (
        <>
            {/* Fixed Position, Background: */}
            <Background />

            <div
                className={classNames(
                    'relative mx-auto flex h-full min-h-screen flex-col items-center justify-start text-left transition-[width]',
                    categoryIsChecked ? navWidthClassesChecked : navWidthClassesUnchecked,
                )}
            >
                <LogoHeader />
                <Content />
                <Nav categoryIsCheckedState={[categoryIsChecked, setCategoryIsChecked]} />
                <SocialsFooter />
            </div>
        </>
    );
};

// ;

export default App;
