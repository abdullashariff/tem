export const currentDate = (val) => {
    let current_datetime = val ? new Date(val) : new Date();
    let m = current_datetime.getMonth();
    let d = current_datetime.getDate();
    let formatted_date = current_datetime.getFullYear() + "-" + (m < 10 ? "0" + (m + 1) : m + 1) + "-" + (d < 10 ? "0" + d : d);
    return formatted_date;
};