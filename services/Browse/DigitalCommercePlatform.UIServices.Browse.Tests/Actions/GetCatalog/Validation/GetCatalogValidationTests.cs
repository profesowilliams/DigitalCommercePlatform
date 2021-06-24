using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using FluentValidation.TestHelper;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions
{
    public class GetCatalogValidationTests
    {
        [Theory]
        [AutoDomainData]
        public async Task GetCatalogValidations(GetCatalogHandler.Request request)
        {
            var validator = new GetCatalogHandler.Validator();
            var result = await validator.TestValidateAsync(request);

            result.Should().NotBeNull();
            result.IsValid.Should().BeTrue();
            result.ShouldNotHaveValidationErrorFor(x => x.Id);
        }

    }
}

        