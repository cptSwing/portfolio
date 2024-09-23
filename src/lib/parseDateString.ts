export default (dateString: string | string[]) => {
    if (Array.isArray(dateString)) {
        return { range: '' };
    } else {
        const yearMonthDay = dateString.split('-');
        return { year: yearMonthDay[0], month: yearMonthDay[1], day: yearMonthDay[2] };
    }
};
