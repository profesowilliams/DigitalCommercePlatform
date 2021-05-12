
module.exports = {
        getRandomDate : function () {
                            let [month, date, year]    = new Date().toLocaleDateString("en-US").split("/");
                            let dayFactor = Math.floor(Math.random() * 7);
                            let deltaFactor = Math.floor(Math.random() * 2) ? 1 : -1;
                            let randomDate = parseInt(date) + dayFactor * deltaFactor;
                            console.log(month, date, year, dayFactor, deltaFactor, randomDate);
                            return new Date(year, month, randomDate).toISOString();
                        }
};

