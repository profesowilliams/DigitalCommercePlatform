//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetRelatedProducts;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions.GetRelatedProducts.Validation
{
    public class RelatedProductsValidationTests
    {
        [Theory]
        [AutoDomainData]
        public async Task RelatedProductsValidationTestMissingProductId(GetRelatedProductsHandler.Request request)
        {
            // Arrange
            var validator = new GetRelatedProductsHandler.Validator();
            request.ProductId = null;
            // Act
            var result = await validator.ValidateAsync(request);
            // Assert
            result.Should().NotBeNull();
            result.IsValid.Should().BeFalse();
        }
    }
}
