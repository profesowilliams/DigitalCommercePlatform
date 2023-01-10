import { formateDatePicker } from "../../../../../utils/utils";

export function setDefaultSearchDateRange(dateRange = '30') {
    const createdFrom = new Date();
    const createdTo = new Date();
    createdFrom.setDate(createdTo.getDate() - (parseInt(dateRange, 10) + 1));
    const createdFromString =  formateDatePicker(createdFrom);
    const createdToString =  formateDatePicker(createdTo);
    return `&createdFrom=${createdFromString}&createdTo=${createdToString}`;
}