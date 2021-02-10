using DigitalCommercePlatform.UIService.Order.Services.Implementations;
using Xunit;

namespace DigitalCommercePlatform.UIService.Order.Tests.Services
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

        [Theory (DisplayName = "Validation succeed with correct sorting value")]
        [InlineData("Id")]
        [InlineData("ShipTo")]
        [InlineData("Created")]
        [InlineData("Type")]
        [InlineData("Price")]
        [InlineData("Status")]
        [InlineData("")]
        [InlineData(null)]
        public void ValidationSucceedWithCorrectSortingValue(string sortingValue)
        {
            var sut = new SortingService();

            var result = sut.IsPropertyValid(sortingValue);

            Assert.True(result);
        }

        [Fact(DisplayName = "Valid properties text is successfully generated")]
        public void ValidPropertiesTextIsSuccessfullyGenerated()
        {
            var sut = new SortingService();

            var result = sut.GetValidProperties();

            Assert.Equal("Id , ShipTo , Created , Type , Price , Status", result);
        }

        [Theory(DisplayName = "Sort by created date ascending when no sorting value is provided")]
        [InlineData("")]
        [InlineData(null)]
        public void SortByCreatedDateAscendingWhenNoSortingValueIsProvided(string sortingValue)
        {
            var sut = new SortingService();

            var (sortingProperty, sortAscending) = sut.GetSortingParameters(sortingValue);

            Assert.Equal("CREATED",sortingProperty);
            Assert.True(sortAscending);
        }


        [Fact(DisplayName = "Sort by created date ascending when wrong sorting property is provided")]
        public void SortByCreatedDateAscendingWhenWrongSortingPropertyIsProvided()
        {
            var sut = new SortingService();

            var (sortingProperty, sortAscending) = sut.GetSortingParameters("wrong");

            Assert.Equal("CREATED", sortingProperty);
            Assert.True(sortAscending);
        }


        [Fact(DisplayName = "Sort descending when sorting value is ending with desc")]
        public void SortDescendingWhenSortingValueIsEndingWithDesc()
        {
            var sut = new SortingService();
            var (sortingProperty, sortAscending) = sut.GetSortingParameters("Price desc");

            Assert.Equal("PRICE", sortingProperty);
            Assert.False(sortAscending);
        }

        [Fact(DisplayName = "Sort ascending when sorting value is ending with asc")]
        public void SortAscendingWhenSortingValueIsEndingWithAsc()
        {
            var sut = new SortingService();
            var (sortingProperty, sortAscending) = sut.GetSortingParameters("Price asc");

            Assert.Equal("PRICE", sortingProperty);
            Assert.True(sortAscending);
        }

        [Fact(DisplayName = "Sort ascending when no sorting type is specified")]
        public void SortAscendingWhenNoSortingTypeIsSpecified()
        {
            var sut = new SortingService();
            var (sortingProperty, sortAscending) = sut.GetSortingParameters("Price");

            Assert.Equal("PRICE", sortingProperty);
            Assert.True(sortAscending);
        }
    }
}
