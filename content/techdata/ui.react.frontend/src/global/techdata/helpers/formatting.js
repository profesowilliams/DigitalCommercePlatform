import { format } from "date-fns"

export function dateToString(date, body = "MMM do',' y") {
    if (!date) return ''
    return format(new Date(date), body);
}

export function removeStringDecimals(stringNumber = "") {
    return stringNumber.replace(/\s*([,.]\d*$)/gm, "");
}

export function thousandSeparator(number, decimalsQuantity = 2) {
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

export function addDays(days = 0, date = new Date(), ) {
  const dateWithDays = date.setDate(date.getDate() + days);
  return new Date(dateWithDays);
}
