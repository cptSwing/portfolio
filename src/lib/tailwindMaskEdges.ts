import plugin from 'tailwindcss/plugin';

// eslint-disable-next-line @typescript-eslint/unbound-method
export default plugin(({ matchUtilities, theme }) => {
    matchUtilities(
        {
            'mask-edges': (all_opacity: string) => {
                const [all, opacity] = all_opacity.split(' ', 2);
                return {
                    '--mask-edges-t': all,
                    '--mask-edges-r': all,
                    '--mask-edges-b': all,
                    '--mask-edges-l': all,
                    '--mask-edges-opacity': opacity,

                    'mask-composite': 'intersect',
                    'mask-image':
                        'linear-gradient(to right, rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 0%, rgba(0, 0, 0, 1) var(--mask-edges-l, 0%) calc(100% - var(--mask-edges-r, -100%)), rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 100%), linear-gradient(to top, rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 0%, rgba(0, 0, 0, 1) var(--mask-edges-b, 0%) calc(100% - var(--mask-edges-t, -100%)), rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 100%)',
                };
            },
            'mask-edges-t': (top_opacity: string) => {
                const [top, opacity] = top_opacity.split(' ', 2);
                return {
                    '--mask-edges-t': top + ' !important',
                    '--mask-edges-opacity': (opacity ?? 0) + ' !important',

                    'mask-composite': 'intersect',
                    'mask-image':
                        'linear-gradient(to right, rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 0%, rgba(0, 0, 0, 1) var(--mask-edges-l, 0%) calc(100% - var(--mask-edges-r, -100%)), rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 100%), linear-gradient(to top, rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 0%, rgba(0, 0, 0, 1) var(--mask-edges-b, 0%) calc(100% - var(--mask-edges-t, -100%)), rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 100%)',
                };
            },
            'mask-edges-r': (right_opacity: string) => {
                const [right, opacity] = right_opacity.split(' ', 2);
                return {
                    '--mask-edges-r': right + ' !important',
                    '--mask-edges-opacity': (opacity ?? 0) + ' !important',

                    'mask-composite': 'intersect',
                    'mask-image':
                        'linear-gradient(to right, rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 0%, rgba(0, 0, 0, 1) var(--mask-edges-l, 0%) calc(100% - var(--mask-edges-r, -100%)), rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 100%), linear-gradient(to top, rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 0%, rgba(0, 0, 0, 1) var(--mask-edges-b, 0%) calc(100% - var(--mask-edges-t, -100%)), rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 100%)',
                };
            },
            'mask-edges-b': (bottom_opacity: string) => {
                const [bottom, opacity] = bottom_opacity.split(' ', 2);
                return {
                    '--mask-edges-b': bottom + ' !important',
                    '--mask-edges-opacity': (opacity ?? 0) + ' !important',

                    'mask-composite': 'intersect',
                    'mask-image':
                        'linear-gradient(to right, rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 0%, rgba(0, 0, 0, 1) var(--mask-edges-l, 0%) calc(100% - var(--mask-edges-r, -100%)), rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 100%), linear-gradient(to top, rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 0%, rgba(0, 0, 0, 1) var(--mask-edges-b, 0%) calc(100% - var(--mask-edges-t, -100%)), rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 100%)',
                };
            },
            'mask-edges-l': (left_opacity: string) => {
                const [left, opacity] = left_opacity.split(' ', 2);
                return {
                    '--mask-edges-l': left + ' !important',
                    '--mask-edges-opacity': (opacity ?? 0) + ' !important',

                    'mask-composite': 'intersect',
                    'mask-image':
                        'linear-gradient(to right, rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 0%, rgba(0, 0, 0, 1) var(--mask-edges-l, 0%) calc(100% - var(--mask-edges-r, -100%)), rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 100%), linear-gradient(to top, rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 0%, rgba(0, 0, 0, 1) var(--mask-edges-b, 0%) calc(100% - var(--mask-edges-t, -100%)), rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 100%)',
                };
            },
            'mask-edges-x': (horizontal_opacity: string) => {
                const [horizontal, opacity] = horizontal_opacity.split(' ', 2);
                return {
                    '--mask-edges-l': horizontal + ' !important',
                    '--mask-edges-r': horizontal + ' !important',
                    '--mask-edges-opacity': (opacity ?? 0) + ' !important',

                    'mask-composite': 'intersect',
                    'mask-image':
                        'linear-gradient(to right, rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 0%, rgba(0, 0, 0, 1) var(--mask-edges-l, 0%) calc(100% - var(--mask-edges-r, -100%)), rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 100%), linear-gradient(to top, rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 0%, rgba(0, 0, 0, 1) var(--mask-edges-b, 0%) calc(100% - var(--mask-edges-t, -100%)), rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 100%)',
                };
            },
            'mask-edges-y': (vertical_opacity: string) => {
                const [vertical, opacity] = vertical_opacity.split(' ', 2);
                return {
                    '--mask-edges-t': vertical + ' !important',
                    '--mask-edges-b': vertical + ' !important',
                    '--mask-edges-opacity': (opacity ?? 0) + ' !important',

                    'mask-composite': 'intersect',
                    'mask-image':
                        'linear-gradient(to right, rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 0%, rgba(0, 0, 0, 1) var(--mask-edges-l, 0%) calc(100% - var(--mask-edges-r, -100%)), rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 100%), linear-gradient(to top, rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 0%, rgba(0, 0, 0, 1) var(--mask-edges-b, 0%) calc(100% - var(--mask-edges-t, -100%)), rgba(0, 0, 0, var(--mask-edges-opacity, 0)) 100%)',
                };
            },
        },
        { values: theme('width') },
    );
});
