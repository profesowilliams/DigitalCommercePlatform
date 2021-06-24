using DigitalCommercePlatform.UIServices.Config.Tests.Common.Factories;
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

        public CriteriaPageNumberTests()
        {
            _validator = GetValidator();
        }

        [Theory]
        [InlineData(-1)]
        [InlineData(0)]
        public async Task PageNumberShouldBeInvalid(int pageNumber)
        {
            var model = new GRC.GetConfigurations.Request
            {
                Criteria = FindModelFactory.CreateValid()
            };
            model.Criteria.PageNumber = pageNumber;

            var result = await _validator.TestValidateAsync(model);

            result.Should().NotBeNull();
            result.IsValid.Should().BeFalse();
            result.ShouldHaveValidationErrorFor(x => x.Criteria.PageNumber);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(255)]
        public async Task PageNumberShouldBeValid(int pageNumber)
        {
            var model = new GRC.GetConfigurations.Request
            {
                Criteria = FindModelFactory.CreateValid()
            };
            model.Criteria.PageNumber = pageNumber;

            var result = await _validator.TestValidateAsync(model);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.Criteria.PageNumber);
        }        
    }
}
