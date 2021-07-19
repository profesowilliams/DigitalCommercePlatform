using DigitalCommercePlatform.UIServices.Config.Models.Common;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using FluentAssertions;
using FluentValidation.TestHelper;
using System;
using System.Threading.Tasks;
using Xunit;
using static DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations.GetConfigurations;
using GRC = DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.GetConfigurations.Validator
{
    public class SortDirectionTests : GetConfigurationsValidatorTestsBase
    {
        private readonly GRC.GetConfigurations.Validator _validator;
        private readonly Request _model;

        public SortDirectionTests()
        {
            _validator = GetValidator();
            _model = GetValidRequest();
        }

        internal class ValidSortDirectionValues : TheoryData<int>
        {
            public ValidSortDirectionValues()
            {
                for (int i = 0; i < 3; i++)
                {
                    AddRow(i);
                }
            }
        };

        [Theory]
        [ClassData(typeof(ValidSortDirectionValues))]
        public async Task SortDirectionIntValidationShouldReturnNoErrors(int x)
        {
            _model.Criteria.SortDirection = (SortDirection)x;
            var result = await _validator.TestValidateAsync(_model);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.Criteria.SortDirection);
        }

        [Theory]
        [InlineData(-2)]
        [InlineData(-1)]
        [InlineData(3)]
        [InlineData(4)]
        public async Task SortDirectionIntValidationShouldReturnError(int x)
        {
            _model.Criteria.SortDirection = (SortDirection)x;
            var result = await _validator.TestValidateAsync(_model);

            result.Should().NotBeNull();
            result.Errors.Should().NotBeEmpty();
            result.ShouldHaveValidationErrorFor(x => x.Criteria.SortDirection);
        }

        [Theory]
        [InlineData("undefined")]
        [InlineData("asc")]
        [InlineData("desc")]
        public async Task SortDirectionStringValidationShouldReturnNoErrors(string s)
        {
            _model.Criteria.SortDirection = Enum.Parse<SortDirection>(s);
            var result = await _validator.TestValidateAsync(_model);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.Criteria.SortDirection);
        }

        [Theory]
        [InlineData(null)]
        [InlineData("")]
        [InlineData(" ")]
        [InlineData("x")]
        [InlineData("Undefined")]
        [InlineData("ascending")]
        [InlineData("Ascending")]
        [InlineData("descending")]
        [InlineData("Descending")]
        public async Task InvalidStringSortDirectionValidationShouldSetUndefinded(string s)
        {
            Enum.TryParse(s, out SortDirection stringParsingResult);
            _model.Criteria.SortDirection = stringParsingResult;
            var result = await _validator.TestValidateAsync(_model);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.Criteria.SortDirection);
            _model.Criteria.SortDirection.Should().Be(SortDirection.undefined);
        }
    }
}
