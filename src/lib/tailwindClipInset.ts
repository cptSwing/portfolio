import plugin from 'tailwindcss/plugin';

// eslint-disable-next-line @typescript-eslint/unbound-method
export default plugin(({ matchUtilities, theme }) => {
    matchUtilities(
        {
            'clip-inset': (insetAll_round: string) => {
                let inset = insetAll_round;
                const borderRadiusIndex = inset.indexOf('round');

                let borderRadius = '';
                if (borderRadiusIndex >= 0) {
                    borderRadius = inset.slice(borderRadiusIndex);
                    inset = inset.slice(0, borderRadiusIndex);
                }

                return {
                    '--tw-clip-inset-t': inset,
                    '--tw-clip-inset-r': inset,
                    '--tw-clip-inset-b': inset,
                    '--tw-clip-inset-l': inset,
                    'clip-path': `inset(var(--tw-clip-inset-t) var(--tw-clip-inset-r) var(--tw-clip-inset-b) var(--tw-clip-inset-l) ${borderRadius});`,
                };
            },
            'clip-inset-t': (insetTop_round: string) => {
                let top = insetTop_round;
                const borderRadiusIndex = top.indexOf('round');

                let borderRadius = '';
                if (borderRadiusIndex >= 0) {
                    borderRadius = top.slice(borderRadiusIndex);
                    top = top.slice(0, borderRadiusIndex);
                }

                return {
                    '--tw-clip-inset-t': top,
                    'clip-path': `inset(var(--tw-clip-inset-t) var(--tw-clip-inset-r, 0%) var(--tw-clip-inset-b, 0%) var(--tw-clip-inset-l, 0%) ${borderRadius});`,
                };
            },
            'clip-inset-r': (insetRight_round: string) => {
                let right = insetRight_round;
                const borderRadiusIndex = right.indexOf('round');

                let borderRadius = '';
                if (borderRadiusIndex >= 0) {
                    borderRadius = right.slice(borderRadiusIndex);
                    right = right.slice(0, borderRadiusIndex);
                }

                return {
                    '--tw-clip-inset-r': right,
                    'clip-path': `inset(var(--tw-clip-inset-t, 0%) var(--tw-clip-inset-r) var(--tw-clip-inset-b, 0%) var(--tw-clip-inset-l, 0%) ${borderRadius});`,
                };
            },
            'clip-inset-b': (insetBottom_round: string) => {
                let bottom = insetBottom_round;
                const borderRadiusIndex = bottom.indexOf('round');

                let borderRadius = '';
                if (borderRadiusIndex >= 0) {
                    borderRadius = bottom.slice(borderRadiusIndex);
                    bottom = bottom.slice(0, borderRadiusIndex);
                }

                return {
                    '--tw-clip-inset-b': bottom,
                    'clip-path': `inset(var(--tw-clip-inset-t, 0%) var(--tw-clip-inset-r, 0%) var(--tw-clip-inset-b) var(--tw-clip-inset-l, 0%) ${borderRadius});`,
                };
            },
            'clip-inset-l': (insetLeft_round: string) => {
                let left = insetLeft_round;
                const borderRadiusIndex = left.indexOf('round');

                let borderRadius = '';
                if (borderRadiusIndex >= 0) {
                    borderRadius = left.slice(borderRadiusIndex);
                    left = left.slice(0, borderRadiusIndex);
                }

                return {
                    '--tw-clip-inset-l': left,
                    'clip-path': `inset(var(--tw-clip-inset-t, 0%) var(--tw-clip-inset-r, 0%) var(--tw-clip-inset-b, 0%) var(--tw-clip-inset-l) ${borderRadius});`,
                };
            },
            'clip-inset-x': (insetHorizontal_round: string) => {
                let horizontal = insetHorizontal_round;
                const borderRadiusIndex = horizontal.indexOf('round');

                let borderRadius = '';
                if (borderRadiusIndex >= 0) {
                    borderRadius = horizontal.slice(borderRadiusIndex);
                    horizontal = horizontal.slice(0, borderRadiusIndex);
                }

                return {
                    '--tw-clip-inset-r': horizontal,
                    '--tw-clip-inset-l': horizontal,
                    'clip-path': `inset(var(--tw-clip-inset-t, 0%) var(--tw-clip-inset-r, 0%) var(--tw-clip-inset-b, 0%) var(--tw-clip-inset-l) ${borderRadius});`,
                };
            },
            'clip-inset-y': (insetVertical_round: string) => {
                let vertical = insetVertical_round;
                const borderRadiusIndex = vertical.indexOf('round');

                let borderRadius = '';
                if (borderRadiusIndex >= 0) {
                    borderRadius = vertical.slice(borderRadiusIndex);
                    vertical = vertical.slice(0, borderRadiusIndex);
                }

                return {
                    '--tw-clip-inset-t': vertical,
                    '--tw-clip-inset-b': vertical,
                    'clip-path': `inset(var(--tw-clip-inset-t, 0%) var(--tw-clip-inset-r, 0%) var(--tw-clip-inset-b, 0%) var(--tw-clip-inset-l) ${borderRadius});`,
                };
            },
        },
        { values: theme('width') },
    );
});
