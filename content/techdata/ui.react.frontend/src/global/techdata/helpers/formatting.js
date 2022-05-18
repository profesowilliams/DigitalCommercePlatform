import { format } from "date-fns"

export function dateToString(date, body = "MMM do',' y") {
    if (!date) return ''
    return format(new Date(date), body);
}

export function removeStringDecimals(stringNumber = "") {
    return stringNumber.replace(/\s*([,.]\d*$)/gm, "");
}

export function thousandSeparator(number = 0, decimalsQuantity = 2) {
    return Number(number).toFixed(decimalsQuantity).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function getTextContentAfterComma(text = "") {
    const reg = /.*?,(.*)/;
    return text.match(reg)[1];
}
function getTextBeforeComma(text = "") {
    const reg = /(.*?),.*/;
    return text.match(reg)[1];
}
export function removeCommaIfContentNull(child = []) {
    if (!Array.isArray(child)) return child
    if (child.length > 2) {
        const afterComma = getTextContentAfterComma(child.join("").trim());
        const beforeComma = getTextBeforeComma(child.join("").trim());
        if (!afterComma || !beforeComma) {
            return child.join("").trim().replace(/,/g, '');
        }
        return child;
    } else {
        return child;
    }
}

export function removeTimeStamp (date) {
    const deleteTimeRegex = /T((?:\d{2}:){2}.*)$/g;
    return new Date(date).toISOString().replace(deleteTimeRegex, () => 'T00:00:00.000Z');
}

export  function setStartOfDayTime(date) {
    return new Date(date.setUTCHours(0,0,0,0));
}

export  function setEndOfDayTime(date) {
    return new Date(date.setUTCHours(23,59,59,999));
}

export function addDays(days = 0, date = new Date(), ) {
  const dateWithDays = date.setDate(date.getDate() + days);
  return new Date(dateWithDays);
}

export function removeDays(days, date = new Date()) {
  const dateWithDays = date.setDate(date.getDate() - days);
  return removeTimeStamp(dateWithDays);
}