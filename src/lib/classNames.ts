const classNames = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(" ") as string;

export default classNames;
