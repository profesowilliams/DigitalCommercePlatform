using DigitalCommercePlatform.UIServices.Config.Tests.Utils.Factories;
using FluentAssertions;
using FluentValidation.TestHelper;
using System.Threading.Tasks;
using Xunit;
using GRC = DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.GetConfigurations.Validator
{
    public class CriteriaPageNumberTests
    {
        [Theory]
        [InlineData(-1)]
        [InlineData(0)]
        public async Task PageNumberShouldBeInvalid(int pageNumber)
        {
            var validator = GetValidator();
            var model = new GRC.GetConfigurations.Request
            {
                Criteria = FindModelFactory.CreateValid()
            };
            model.Criteria.PageNumber = pageNumber;

            var result = await validator.TestValidateAsync(model);

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
            var validator = GetValidator();
            var model = new GRC.GetConfigurations.Request
            {
                Criteria = FindModelFactory.CreateValid()
            };
            model.Criteria.PageNumber = pageNumber;

            var result = await validator.TestValidateAsync(model);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.Criteria.PageNumber);
        }

        private static GRC.GetConfigurations.Validator GetValidator()
        {
            return new GRC.GetConfigurations.Validator();
        }
    }
}
