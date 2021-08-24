//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using FluentValidation.TestHelper;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions
{
    public class ProductDetailsValidationTests
    {
        [Theory]
        [AutoDomainData]
        public async Task ProductDetailsValidations(GetProductDetailsHandler.Request request)
        {
            var validator = new GetProductDetailsHandler.Validator();
            var result = await validator.TestValidateAsync(request);

            result.Should().NotBeNull();
            result.IsValid.Should().BeFalse();
            result.ShouldNotHaveValidationErrorFor(x => x.Id);
        }

        [Theory]
        [AutoDomainData]
        public async Task ProductSummaryValidations(GetProductSummaryHandler.Request request)
        {
            var validator = new GetProductSummaryHandler.Validator();
            var result = await validator.TestValidateAsync(request);

            result.Should().NotBeNull();
            result.IsValid.Should().BeTrue();
            result.ShouldNotHaveValidationErrorFor(x => x.Id);
        }

    }
}

        
