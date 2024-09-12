export default (dateString: string) => {
    const yearMonthDay = dateString.split('-');
    return { year: yearMonthDay[0], month: yearMonthDay[1], day: yearMonthDay[2] };
};
