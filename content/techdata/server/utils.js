module.exports = {
    getRandomDate: function () {
        let [month, date, year] = new Date()
            .toLocaleDateString("en-US")
            .split("/");
        let dayFactor = Math.floor(Math.random() * 7);
        let deltaFactor = Math.floor(Math.random() * 2) ? 1 : -1;
        let randomDate = parseInt(date) + dayFactor * deltaFactor;
        console.log(month, date, year, dayFactor, deltaFactor, randomDate);
        return new Date(year, month, randomDate).toISOString();
    },
    getRandomArrayWithIds: (maxLength) => {
        const arrayLength = Math.floor(Math.random() * (maxLength + 1));
        let ids = [];
        const itemDefinition = {
            id: "123456789",
            version: "1",
            vendorId: "2323232",
            selectionFlag: "flag",
        };
        for (let i = 0; i < arrayLength; i++) {
            ids.push(itemDefinition);
        }
        return ids;
    },
    getRandomValues(range)
    {
        return  String(1.0 * Math.floor(Math.random() * (range + 1)));
    }
};
