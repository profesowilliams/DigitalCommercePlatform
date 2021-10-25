import {format} from "date-fns"

export function dateToString(date, body = "MMM do',' y") {
    if (!date) return ''
    return format(new Date(date),body);
}

export function removeStringDecimals (stringNumber=""){
    return stringNumber.replace(/\s*([,.]\d*$)/gm,"");
}

export function thousandSeparator(number,decimalsQuantity=2) {
    return Number(number).toFixed(decimalsQuantity).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}