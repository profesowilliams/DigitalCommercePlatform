import moment from "moment"
export function dateToString(date, body = 'll') {
    return moment(date).format(body);
}

export function removeStringDecimals (stringNumber=""){
    return stringNumber.replace(/\s*([,.]\d*$)/gm,"");
}

export function thousandSeparator(number,decimalsQuantity=2) {
    return Number(number).toFixed(decimalsQuantity).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}