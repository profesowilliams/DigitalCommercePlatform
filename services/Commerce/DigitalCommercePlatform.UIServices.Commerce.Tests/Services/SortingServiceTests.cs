using DigitalCommercePlatform.UIServices.Commerce.Services;
using System;
using System.Collections.Generic;
using System.Text;
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

        [Theory(DisplayName = "Validation succeed with correct sorting value")]
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
    }
}
