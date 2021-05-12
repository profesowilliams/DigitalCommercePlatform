using DigitalCommercePlatform.UIServices.Commerce.Services;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Services
{
    public class SortingServiceTests
    {
        [Fact(DisplayName = "Validation failed with incorect sorting value")]
        public void ValidationFailedWithIncorectSortingValue()
        {
            var sut = new SortingService();

            var result = sut.IsPropertyValid("wrong");

            Assert.False(result);
        }

        [Fact(DisplayName = "Validation failed with incorect sorting order value")]
        public void ValidationFailedWithIncorectSortingOrderValue()
        {
            var sut = new SortingService();

            var result = sut.IsSortingDirectionValid("aaaasssscccc");

            Assert.False(result);
        }

        [Theory(DisplayName = "Validation succeed with correct sorting value")]
        [InlineData("Id")]
        [InlineData("ShipTo")]
        [InlineData("Created")]
        [InlineData("Type")]
        [InlineData("Price")]
        [InlineData("Status")]
        [InlineData("PriceFormatted")]
        [InlineData("")]
        [InlineData(null)]
        public void ValidationSucceedWithCorrectSortingValue(string sortingValue)
        {
            var sut = new SortingService();

            var result = sut.IsPropertyValid(sortingValue);

            Assert.True(result);
        }

        [Theory(DisplayName = "Validation succeed with correct sorting order value")]
        [InlineData("asc")]
        [InlineData("ASC")]
        [InlineData("desc")]
        [InlineData("DESC")]
        [InlineData("")]
        [InlineData(null)]
        public void ValidationSucceedWithCorrectSortingOrderValue(string sortingValue)
        {
            var sut = new SortingService();

            var result = sut.IsSortingDirectionValid(sortingValue);

            Assert.True(result);
        }

        [Fact(DisplayName = "Valid properties text is successfully generated")]
        public void ValidPropertiesTextIsSuccessfullyGenerated()
        {
            var sut = new SortingService();

            var result = sut.GetValidProperties();

            Assert.Equal("Id , ShipTo , Created , Type , Price , Status , PriceFormatted", result);
        }

        [Fact(DisplayName = "Valid sorting values text is successfully generated")]
        public void ValidSortingValuesTextIsSuccessfullyGenerated()
        {
            var sut = new SortingService();

            var result = sut.GetValidSortingValues();

            Assert.Equal("asc , desc", result);
        }

        [Theory(DisplayName = "Sort by created date when no sorting value is provided")]
        [InlineData("")]
        [InlineData(null)]
        public void SortByCreatedDateWhenNoSortingValueIsProvided(string sortingValue)
        {
            var sut = new SortingService();

            var sortingProperty = sut.GetSortingProperty(sortingValue);

            Assert.Equal("CREATED", sortingProperty);
        }


        [Fact(DisplayName = "Sort by created date when wrong sorting property is provided")]
        public void SortByCreatedDateAscendingWhenWrongSortingPropertyIsProvided()
        {
            var sut = new SortingService();

            var sortingProperty = sut.GetSortingProperty("wrong");

            Assert.Equal("CREATED", sortingProperty);
        }

        [Theory(DisplayName = "Sort by property that is matching to provided argument")]
        [InlineData("Id", "ID")]
        [InlineData("ShipTo", "SHIPTONAME")]
        [InlineData("Created", "CREATED")]
        [InlineData("Type", "ORDERTYPE")]
        [InlineData("Price", "PRICE")]
        [InlineData("Status", "ORDERSTATUS")]
        [InlineData("PriceFormatted", "PRICE")]

    public void SortByPropertyThatIsMatchingToProvidedArgument(string argument,string matchingValue)
        {
            var sut = new SortingService();

            var sortingProperty = sut.GetSortingProperty(argument);

            Assert.Equal(matchingValue, sortingProperty);
        }

        [Theory(DisplayName = "Sort by ordering value that is matching to provided argument")]
        [InlineData("asc", true)]
        [InlineData("ASC", true)]
        [InlineData("desc", false)]
        [InlineData("DESC", false)]
        [InlineData("", true)]
        [InlineData(null, true)]
        public void SortByOrderingValueThatIsMatchingToProvidedArgument(string argument, bool matchingValue)
        {
            var sut = new SortingService();

            var sortingProperty = sut.IsSortingDirectionAscending(argument);

            Assert.Equal(matchingValue, sortingProperty);
        }
    }
}
