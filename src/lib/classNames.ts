const classNames = (...classes: (string | undefined)[]) => {
    return classes.filter(Boolean).join(" ") as string;
};

export default classNames;
