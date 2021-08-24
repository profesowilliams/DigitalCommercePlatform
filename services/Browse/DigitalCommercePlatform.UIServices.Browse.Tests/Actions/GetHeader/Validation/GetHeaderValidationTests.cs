//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using FluentValidation.TestHelper;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions
{
    public class GetHeaderValidationTests
    {
        [Theory]
        [AutoDomainData]
        public async Task GetHeaderValidations(GetHeaderHandler.Request request)
        {
            var validator = new GetHeaderHandler.Validator();
            var result = await validator.TestValidateAsync(request);

            result.Should().NotBeNull();
            result.IsValid.Should().BeTrue();
            result.ShouldNotHaveValidationErrorFor(x => x.CatalogCriteria);
        }

    }
}

        
