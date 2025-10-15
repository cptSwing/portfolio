import { HAMBURGERMENUITEMS } from '../types/enums';
import { HamburgerMenuItem } from '../types/types';
import { historyRouter } from './historyRouter';
import { useZustand } from './zustand';

const { store_toggleHamburgerMenu, store_toggleActiveHamburgerItem, store_cycleTheme } = useZustand.getState().methods;

const hamburgerMenuItems: HamburgerMenuItem = {
    name: 'DEFAULT',
    iconPath: 'url(/svg/XMarkOutline.svg)',
    iconSize: 70,
    clickHandler: () => store_toggleHamburgerMenu(null),
    subMenuItems: [
        {
            name: 'Config',
            iconPath: `url(${HAMBURGERMENUITEMS.Config})`,
            iconSize: 50,
            clickHandler: () => store_toggleActiveHamburgerItem('Config'),
            subMenuItems: [
                {
                    name: 'Corners',
                    iconPath: `url(${HAMBURGERMENUITEMS.Corners})`,
                    iconSize: 50,
                    clickHandler: () => {},
                    startOffset: 5,
                },
                {
                    name: 'Theme',
                    iconPath: `url(${HAMBURGERMENUITEMS.Theme})`,
                    iconSize: 50,
                    clickHandler: () => store_cycleTheme(),
                    startOffset: 5,
                },
            ],
        },
        {
            name: 'Contact',
            iconPath: `url(${HAMBURGERMENUITEMS.Contact})`,
            iconSize: 50,
            clickHandler: () => store_toggleActiveHamburgerItem('Contact'),
            subMenuItems: [
                {
                    name: 'Linkedin',
                    iconPath: `url(${HAMBURGERMENUITEMS.Linkedin})`,
                    iconSize: 45,
                    clickHandler: () => openNewWindowOrRedirect('https://www.linkedin.com/in/jensbrandenburg'),
                },
                {
                    name: 'Github',
                    iconPath: `url(${HAMBURGERMENUITEMS.Github})`,
                    iconSize: 50,
                    clickHandler: () => openNewWindowOrRedirect('https://github.com/cptSwing'),
                },
                {
                    name: 'Email',
                    iconPath: `url(${HAMBURGERMENUITEMS.Email})`,
                    iconSize: 50,
                    clickHandler: () => openNewWindowOrRedirect('mailto:jens@jbrandenburg.de'),
                },
            ],
        },
        {
            name: 'Me',
            iconPath: `url(${HAMBURGERMENUITEMS.Me})`,
            iconSize: 45,
            clickHandler: () => store_toggleActiveHamburgerItem('Me'),
            subMenuItems: [
                {
                    name: 'Bio / CV',
                    iconPath: `url(${HAMBURGERMENUITEMS['Bio / CV']})`,
                    iconSize: 50,
                    startOffset: 2,
                    clickHandler: () => store_toggleActiveHamburgerItem('Bio / CV'),
                    subMenuItems: [
                        {
                            name: 'CV (English)',
                            iconPath: `url(${HAMBURGERMENUITEMS['CV (English)']})`,
                            iconSize: 45,
                            clickHandler: () => openNewWindowOrRedirect('./public/pdfs/Jens_Brandenburg_WebDev_1-Page_CV_EN.pdf'),
                        },
                        {
                            name: 'Bio',
                            iconPath: `url(${HAMBURGERMENUITEMS.Bio})`,
                            iconSize: 45,
                            clickHandler: () => openNewWindowOrRedirect('https://www.turbosquid.com/Search/Artists/cptSwing'),
                        },
                        {
                            name: 'Lebenslauf',
                            iconPath: `url(${HAMBURGERMENUITEMS.Lebenslauf})`,
                            iconSize: 45,
                            clickHandler: () => openNewWindowOrRedirect('./public/pdfs/Jens_Brandenburg_WebDev_1-Page_CV_DE.pdf'),
                        },
                    ],
                },
                {
                    name: '3D Stores',
                    iconPath: `url(${HAMBURGERMENUITEMS['3D Stores']})`,
                    iconSize: 50,
                    startOffset: 2,
                    clickHandler: () => store_toggleActiveHamburgerItem('3D Stores'),
                    subMenuItems: [
                        {
                            name: 'CGTrader',
                            clickHandler: () => openNewWindowOrRedirect('https://www.cgtrader.com/designers/cptswing'),

                            startOffset: 2,
                        },
                        {
                            name: 'TurboSquid',
                            clickHandler: () => openNewWindowOrRedirect('https://www.turbosquid.com/Search/Artists/cptSwing'),
                            startOffset: 2,
                        },
                        {
                            name: 'Printables',
                            clickHandler: () => openNewWindowOrRedirect('https://www.printables.com/@cptSwing_2552270'),
                            startOffset: 2,
                        },
                        {
                            name: 'Thingiverse',
                            clickHandler: () => openNewWindowOrRedirect('https://www.thingiverse.com/cptswing/designs'),
                            startOffset: 2,
                        },
                    ],
                },
                {
                    name: 'Imprint',
                    iconPath: `url(${HAMBURGERMENUITEMS.Imprint})`,
                    iconSize: 50,
                    startOffset: 2,
                    clickHandler: () => historyRouter.navigate && historyRouter.navigate('/'),
                },
            ],
        },
        {
            name: 'Home',
            iconPath: `url(${HAMBURGERMENUITEMS.Home})`,
            iconSize: 50,
            startOffset: 1,
            clickHandler: () => historyRouter.navigate && historyRouter.navigate('/'),
        },
    ],
};

export default hamburgerMenuItems;

function openNewWindowOrRedirect(url: string) {
    if (!window.open(url)) window.location.href = url;
}
