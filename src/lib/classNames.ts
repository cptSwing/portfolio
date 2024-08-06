const classNames = (...classes: (string | boolean | undefined)[]) => classes.filter(Boolean).join(' ');

export default classNames;
