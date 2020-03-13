//A trivial JS function to convert the time since epoch to a date
use(function () {
    var d = new Date(this.value);
    return {Date:d, ShortDate:d.toLocaleDateString()};
});
