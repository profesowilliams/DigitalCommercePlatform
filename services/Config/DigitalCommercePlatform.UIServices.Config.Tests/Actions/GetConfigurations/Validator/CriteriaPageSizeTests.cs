using DigitalCommercePlatform.UIServices.Config.Tests.Common.Factories;
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

        public CriteriaPageSizeTests()
        {
            _validator = GetValidator();
        }

        [Theory]
        [InlineData(-1)]
        [InlineData(0)]
        public async Task PageSizeShouldBeInvalid(int pageSize)
        {
            var model = new GRC.GetConfigurations.Request
            {
                Criteria = FindModelFactory.CreateValid()
            };
            model.Criteria.PageSize = pageSize;

            var result = await _validator.TestValidateAsync(model);

            result.Should().NotBeNull();
            result.IsValid.Should().BeFalse();
            result.ShouldHaveValidationErrorFor(x => x.Criteria.PageSize);
        }

        [Theory]
        [InlineData(1)]
        [InlineData(2)]
        [InlineData(255)]
        public async Task PageSizeShouldBeValid(int pageSize)
        {
            var model = new GRC.GetConfigurations.Request
            {
                Criteria = FindModelFactory.CreateValid()
            };
            model.Criteria.PageSize = pageSize;

            var result = await _validator.TestValidateAsync(model);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.Criteria.PageSize);
        }
    }
}
