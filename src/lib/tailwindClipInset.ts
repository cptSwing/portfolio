import plugin from 'tailwindcss/plugin';

const splitArgsAtRound = (string: string) => {
    let borderRadius = '',
        inset = string;

    const borderRadiusIndex = string.indexOf('round');
    if (borderRadiusIndex >= 0) {
        borderRadius = string.slice(borderRadiusIndex);
        inset = string.slice(0, borderRadiusIndex);
    }
    return [inset, borderRadius];
};

// eslint-disable-next-line @typescript-eslint/unbound-method
export default plugin(({ matchUtilities, theme }) => {
    matchUtilities(
        {
            'clip-inset': (insetAll_round: string) => {
                const [inset, borderRadius] = splitArgsAtRound(insetAll_round);

                return {
                    '--tw-clip-inset-t': inset,
                    '--tw-clip-inset-r': inset,
                    '--tw-clip-inset-b': inset,
                    '--tw-clip-inset-l': inset,
                    'clip-path': `inset(var(--tw-clip-inset-t) var(--tw-clip-inset-r) var(--tw-clip-inset-b) var(--tw-clip-inset-l) ${borderRadius});`,
                };
            },
            'clip-inset-t': (insetTop_round: string) => {
                const [top, borderRadius] = splitArgsAtRound(insetTop_round);

                return {
                    '--tw-clip-inset-t': top,
                    'clip-path': `inset(var(--tw-clip-inset-t) var(--tw-clip-inset-r, 0%) var(--tw-clip-inset-b, 0%) var(--tw-clip-inset-l, 0%) ${borderRadius});`,
                };
            },
            'clip-inset-r': (insetRight_round: string) => {
                const [right, borderRadius] = splitArgsAtRound(insetRight_round);

                return {
                    '--tw-clip-inset-r': right,
                    'clip-path': `inset(var(--tw-clip-inset-t, 0%) var(--tw-clip-inset-r) var(--tw-clip-inset-b, 0%) var(--tw-clip-inset-l, 0%) ${borderRadius});`,
                };
            },
            'clip-inset-b': (insetBottom_round: string) => {
                const [bottom, borderRadius] = splitArgsAtRound(insetBottom_round);

                return {
                    '--tw-clip-inset-b': bottom,
                    'clip-path': `inset(var(--tw-clip-inset-t, 0%) var(--tw-clip-inset-r, 0%) var(--tw-clip-inset-b) var(--tw-clip-inset-l, 0%) ${borderRadius});`,
                };
            },
            'clip-inset-l': (insetLeft_round: string) => {
                const [left, borderRadius] = splitArgsAtRound(insetLeft_round);

                return {
                    '--tw-clip-inset-l': left,
                    'clip-path': `inset(var(--tw-clip-inset-t, 0%) var(--tw-clip-inset-r, 0%) var(--tw-clip-inset-b, 0%) var(--tw-clip-inset-l) ${borderRadius});`,
                };
            },
            'clip-inset-x': (insetHorizontal_round: string) => {
                const [horizontal, borderRadius] = splitArgsAtRound(insetHorizontal_round);

                return {
                    '--tw-clip-inset-r': horizontal,
                    '--tw-clip-inset-l': horizontal,
                    'clip-path': `inset(var(--tw-clip-inset-t, 0%) var(--tw-clip-inset-r) var(--tw-clip-inset-b, 0%) var(--tw-clip-inset-l) ${borderRadius});`,
                };
            },
            'clip-inset-y': (insetVertical_round: string) => {
                const [vertical, borderRadius] = splitArgsAtRound(insetVertical_round);

                return {
                    '--tw-clip-inset-t': vertical,
                    '--tw-clip-inset-b': vertical,
                    'clip-path': `inset(var(--tw-clip-inset-t) var(--tw-clip-inset-r, 0%) var(--tw-clip-inset-b) var(--tw-clip-inset-l, 0%) ${borderRadius});`,
                };
            },
        },
        { values: theme('width') },
    );
});
