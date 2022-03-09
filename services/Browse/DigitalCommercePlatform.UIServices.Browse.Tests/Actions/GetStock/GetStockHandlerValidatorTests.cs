//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetStock;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions.GetStock
{
    public class GetStockHandlerValidatorTests
    {
        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData("  ")]
        public async Task GetStockHandlerValidatorIsNotValid(string id)
        {
            // Arrange
            var validator = new GetStockHandler.Validator();
            var request = new GetStockHandler.Request(id);

            // Act
            var result = await validator.ValidateAsync(request);

            // Assert
            result.Should().NotBeNull();
            result.IsValid.Should().BeFalse();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetStockHandlerValidatorIsValid(GetStockHandler.Request request)
        {
            // Arrange
            var validator = new GetStockHandler.Validator();

            // Act
            var result = await validator.ValidateAsync(request);

            // Assert
            result.Should().NotBeNull();
            result.IsValid.Should().BeTrue();
        }
    }
}