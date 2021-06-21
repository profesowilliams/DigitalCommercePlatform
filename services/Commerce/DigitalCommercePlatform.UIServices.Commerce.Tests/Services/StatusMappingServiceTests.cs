using DigitalCommercePlatform.UIServices.Commerce.Services;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Services
{
    public class StatusMappingServiceTests
    {
        [Theory(DisplayName = "Valid status value is successfully generated")]
        [InlineData("open", "OPEN")]
        [InlineData("cancelled", "CANCELLED")]
        [InlineData("onHold", "ON_HOLD")]
        [InlineData("shipped", "SHIPPED")]
        [InlineData("inProcess", "IN_PROCESS")]
        [InlineData("", null)]
        [InlineData("         ", null)]
        [InlineData("wrong", null)]
        [InlineData(null, null)]
        public void ValidStatusValueIsSuccessfullyGenerated(string argument, string matchingValue)
        {
            var sut = new StatusMappingService();

            var statusValue = sut.GetMappingPropertyValue(argument);

            Assert.Equal(matchingValue, statusValue);
        }

        [Fact(DisplayName = "Validation failed with incorect status value")]
        public void ValidationFailedWithIncorectStatusValue()
        {
            var sut = new StatusMappingService();

            var result = sut.IsStatusValid("wrong");

            Assert.False(result);
        }

        [Theory(DisplayName = "Validation succeed with correct status value")]
        [InlineData("open")]
        [InlineData("cancelled")]
        [InlineData("onHold")]
        [InlineData("shipped")]
        [InlineData("inProcess")]
        [InlineData("")]
        [InlineData(null)]
        public void ValidationSucceedWithCorrectStatusValue(string status)
        {
            var sut = new StatusMappingService();

            var result = sut.IsStatusValid(status);

            Assert.True(result);
        }

        [Fact(DisplayName = "Valid status values text is successfully generated")]
        public void ValidStatusValuesTextIsSuccessfullyGenerated()
        {
            var sut = new StatusMappingService();

            var result = sut.GetValidStatusValues();

            Assert.Equal("open , cancelled , onHold , shipped , inProcess", result);
        }
    }
}
