using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Tests.Utils.Factories;
using FluentAssertions;
using FluentValidation.TestHelper;
using System.Threading.Tasks;
using Xunit;
using GRC = DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.Validators.GetConfigurations
{
    public class CriteriaPageSize
    {
        [Theory]
        [InlineData(-1)]
        [InlineData(0)]
        public async Task PageSizeShouldBeInvalid(int pageSize)
        {
            var validator = GetValidator();
            var model = new GRC.GetConfigurations.Request
            {
                Criteria = FindModelFactory.CreateValid()
            };
            model.Criteria.PageSize = pageSize;

            var result = await validator.TestValidateAsync(model);

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
            var validator = GetValidator();
            var model = new GRC.GetConfigurations.Request
            {
                Criteria = FindModelFactory.CreateValid()
            };
            model.Criteria.PageSize = pageSize;

            var result = await validator.TestValidateAsync(model);

            result.Should().NotBeNull();
            result.IsValid.Should().BeTrue();
            result.Errors.Should().BeEmpty();
        }

        private static GRC.GetConfigurations.Validator GetValidator()
        {
            return new GRC.GetConfigurations.Validator();
        }
    }
}
