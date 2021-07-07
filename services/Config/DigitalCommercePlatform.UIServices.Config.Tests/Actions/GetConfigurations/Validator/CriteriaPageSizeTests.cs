using FluentAssertions;
using FluentValidation.TestHelper;
using System.Threading.Tasks;
using Xunit;
using GRC = DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.GetConfigurations.Validator
{
    public class CriteriaPageSizeTests : GetConfigurationsValidatorTestsBase
    {
        private readonly GRC.GetConfigurations.Validator _validator;
        private readonly GRC.GetConfigurations.Request _request;

        public CriteriaPageSizeTests()
        {
            _validator = GetValidator();
            _request = GetValidRequest();
        }

        [Theory]
        [InlineData(-1)]
        [InlineData(0)]
        public async Task PageSizeValidationShouldReturnError(int pageSize)
        {
            _request.Criteria.PageSize = pageSize;
            var result = await _validator.TestValidateAsync(_request);

            result.Should().NotBeNull();
            result.IsValid.Should().BeFalse();
            result.ShouldHaveValidationErrorFor(x => x.Criteria.PageSize);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(255)]
        public async Task PageSizeValidationShouldReturnNoErrors(int pageSize)
        {
            _request.Criteria.PageSize = pageSize;
            var result = await _validator.TestValidateAsync(_request);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.Criteria.PageSize);
        }
    }
}
