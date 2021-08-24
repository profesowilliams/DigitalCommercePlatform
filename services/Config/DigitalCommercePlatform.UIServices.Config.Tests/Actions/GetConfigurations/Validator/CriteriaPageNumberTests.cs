//2021 (c) Tech Data Corporation -. All Rights Reserved.
using FluentAssertions;
using FluentValidation.TestHelper;
using System.Threading.Tasks;
using Xunit;
using GRC = DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.GetConfigurations.Validator
{
    public class CriteriaPageNumberTests : GetConfigurationsValidatorTestsBase
    {
        private readonly GRC.GetConfigurations.Validator _validator;
        private readonly GRC.GetConfigurations.Request _request;

        public CriteriaPageNumberTests()
        {
            _validator = GetValidator();
            _request = GetValidRequest();
        }

        [Theory]
        [InlineData(-1)]
        [InlineData(0)]
        public async Task PageNumberValidationShouldReturnError(int pageNumber)
        {
            _request.Criteria.PageNumber = pageNumber;
            var result = await _validator.TestValidateAsync(_request);

            result.Should().NotBeNull();
            result.IsValid.Should().BeFalse();
            result.ShouldHaveValidationErrorFor(x => x.Criteria.PageNumber);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(255)]
        public async Task PageNumberValidationShouldReturnNoErrors(int pageNumber)
        {
            _request.Criteria.PageNumber = pageNumber;
            var result = await _validator.TestValidateAsync(_request);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.Criteria.PageNumber);
        }        
    }
}
