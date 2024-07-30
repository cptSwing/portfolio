const classNames = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ');

export default classNames;
