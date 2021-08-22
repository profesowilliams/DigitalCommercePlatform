import moment from "moment"
export function dateToString(date, body = 'll') {
    return moment(date).format(body);
}