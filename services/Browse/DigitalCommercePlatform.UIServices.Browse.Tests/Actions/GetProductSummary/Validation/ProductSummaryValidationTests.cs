//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductSummary;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using FluentValidation.TestHelper;
using Moq;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions
{
    public class ProductSummaryValidationTests
    {
         private readonly Mock<ISortingService> _mockSortingService;

        public ProductSummaryValidationTests()
        {
            _mockSortingService = new();
        }

        [Theory]
        [AutoDomainData]
        public async Task FindProductValidations(FindProductHandler.Request request)
        {

            var validator = new FindProductHandler.Validator(_mockSortingService.Object);
            var result = await validator.TestValidateAsync(request);

            result.Should().NotBeNull();
            result.IsValid.Should().BeFalse();
        }
    }
}

        
