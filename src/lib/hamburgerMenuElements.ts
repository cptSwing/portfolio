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
                    name: 'Theme',
                    iconPath: `url(${HAMBURGERMENUITEMS.Theme})`,
                    iconSize: 50,
                    clickHandler: () => store_cycleTheme(),
                },
                {
                    name: 'Corners',
                    iconPath: `url(${HAMBURGERMENUITEMS.Corners})`,
                    iconSize: 50,
                    clickHandler: () => {},
                    startOffset: 3,
                    isActive: false,
                },
                {
                    name: '_NotDecided',
                    // iconPath: `url(${HAMBURGERMENUITEMS._NotDecided})`,
                    iconSize: 50,
                    clickHandler: () => {},
                    startOffset: 3,
                    isActive: false,
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
                    isLink: true,
                },

                {
                    name: 'Email',
                    iconPath: `url(${HAMBURGERMENUITEMS.Email})`,
                    iconSize: 50,
                    clickHandler: () => openNewWindowOrRedirect('mailto:jens@jbrandenburg.de'),
                    isLink: true,
                },
                {
                    name: 'Imprint',
                    iconPath: `url(${HAMBURGERMENUITEMS.Imprint})`,
                    iconSize: 50,
                    clickHandler: () => historyRouter.navigate && historyRouter.navigate('/'),
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
                    startOffset: 1,
                    clickHandler: () => store_toggleActiveHamburgerItem('Bio / CV'),
                    subMenuItems: [
                        {
                            name: 'CV (English)',
                            iconPath: `url(${HAMBURGERMENUITEMS['CV (English)']})`,
                            iconSize: 45,
                            clickHandler: () => openNewWindowOrRedirect('./public/pdfs/Jens_Brandenburg_WebDev_1-Page_CV_EN.pdf'),
                            isLink: true,
                        },
                        {
                            name: 'Bio',
                            iconPath: `url(${HAMBURGERMENUITEMS.Bio})`,
                            iconSize: 45,
                            clickHandler: () => openNewWindowOrRedirect('https://www.turbosquid.com/Search/Artists/cptSwing'),
                            isLink: true,
                        },
                        {
                            name: 'Lebenslauf',
                            iconPath: `url(${HAMBURGERMENUITEMS.Lebenslauf})`,
                            iconSize: 45,
                            clickHandler: () => openNewWindowOrRedirect('./public/pdfs/Jens_Brandenburg_WebDev_1-Page_CV_DE.pdf'),
                            isLink: true,
                        },
                    ],
                },
                {
                    name: 'Github',
                    iconPath: `url(${HAMBURGERMENUITEMS.Github})`,
                    iconSize: 50,
                    startOffset: 1,
                    clickHandler: () => openNewWindowOrRedirect('https://github.com/cptSwing'),
                    isLink: true,
                },
                {
                    name: '3D Stores',
                    iconPath: `url(${HAMBURGERMENUITEMS['3D Stores']})`,
                    iconSize: 50,
                    startOffset: 1,
                    clickHandler: () => store_toggleActiveHamburgerItem('3D Stores'),
                    subMenuItems: [
                        {
                            name: 'CGTrader',
                            clickHandler: () => openNewWindowOrRedirect('https://www.cgtrader.com/designers/cptswing'),
                            isLink: true,

                            startOffset: 2,
                        },
                        {
                            name: 'TurboSquid',
                            clickHandler: () => openNewWindowOrRedirect('https://www.turbosquid.com/Search/Artists/cptSwing'),
                            isLink: true,
                            startOffset: 2,
                        },
                        {
                            name: 'Printables',
                            clickHandler: () => openNewWindowOrRedirect('https://www.printables.com/@cptSwing_2552270'),
                            isLink: true,
                            startOffset: 2,
                        },
                        {
                            name: 'Thingiverse',
                            clickHandler: () => openNewWindowOrRedirect('https://www.thingiverse.com/cptswing/designs'),
                            isLink: true,
                            startOffset: 2,
                        },
                    ],
                },
                {
                    name: 'Socials',
                    // iconPath: `url(${HAMBURGERMENUITEMS.Socials})`,
                    iconSize: 50,
                    clickHandler: () => {},
                    startOffset: 1,
                    isActive: false,
                },
            ],
        },
        {
            name: 'Home',
            iconPath: `url(${HAMBURGERMENUITEMS.Home})`,
            iconSize: 50,
            startOffset: 1,
            clickHandler: () => {
                if (historyRouter.navigate) {
                    historyRouter.navigate('/');
                    store_toggleHamburgerMenu(null);
                }
            },
        },
    ],
};

export default hamburgerMenuItems;

function openNewWindowOrRedirect(url: string) {
    if (!window.open(url)) window.location.href = url;
}
