using DigitalCommercePlatform.UIServices.Config.Models.Common;
using FluentAssertions;
using FluentValidation.TestHelper;
using System;
using System.Threading.Tasks;
using Xunit;
using GRD = DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.GetDeals.Validator
{
    public class SortDirectionTests : GetDealsValidatorTestsBase
    {
        private readonly GRD.GetDeals.Validator _validator;
        private readonly GRD.GetDeals.Request _model;

        public SortDirectionTests()
        {
            _validator = GetValidator();
            _model = GetValidModel();
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
            _model.SortDirection = (SortDirection)x;
            var result = await _validator.TestValidateAsync(_model);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.SortDirection);
        }

        [Theory]
        [InlineData(-2)]
        [InlineData(-1)]
        [InlineData(3)]
        [InlineData(4)]
        public async Task SortDirectionIntValidationShouldReturnError(int x)
        {
            _model.SortDirection = (SortDirection)x;
            var result = await _validator.TestValidateAsync(_model);

            result.Should().NotBeNull();
            result.Errors.Should().NotBeEmpty();
            result.ShouldHaveValidationErrorFor(x => x.SortDirection);
        }

        [Theory]
        [InlineData("undefined")]
        [InlineData("asc")]
        [InlineData("desc")]
        public async Task SortDirectionStringValidationShouldReturnNoErrors(string s)
        {
            _model.SortDirection = Enum.Parse<SortDirection>(s);
            var result = await _validator.TestValidateAsync(_model);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.SortDirection);
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
            _model.SortDirection = stringParsingResult;
            var result = await _validator.TestValidateAsync(_model);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.SortDirection);
            _model.SortDirection.Should().Be(SortDirection.undefined);
        }
    }
}
