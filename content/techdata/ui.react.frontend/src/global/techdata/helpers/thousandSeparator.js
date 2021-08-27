export default function thousandSeparator(x) {
    return Number(x).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}