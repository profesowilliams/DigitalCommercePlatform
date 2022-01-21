//2021 (c) Tech Data Corporation -. All Rights Reserved.
using FluentAssertions;
using FluentValidation.TestHelper;
using System;
using System.Threading.Tasks;
using Xunit;
using static DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals.GetDeals.Request;
using GRD = DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.GetDeals.Validator
{
    public class SortTests : GetDealsValidatorTestsBase
    {
        private readonly GRD.GetDeals.Validator _validator;
        private readonly GRD.GetDeals.Request _model;

        public SortTests()
        {
            _validator = GetValidator();
            _model = GetValidModel();
        }

        [Fact]
        public async Task SortNullValidationShouldReturnNoErrors()
        {
            var result = await _validator.TestValidateAsync(_model);

            result.ShouldNotHaveValidationErrorFor(x => x.Sort);
        }

        internal class ValidSortValues : TheoryData<int?>
        {
            public ValidSortValues()
            {
                for (int i = 0; i < 4; i++)
                {
                    Add(i);
                }
            }
        };

        [Theory]
        [ClassData(typeof(ValidSortValues))]
        public async Task SortIntValidationShouldReturnNoErrors(int? x)
        {
            _model.Sort = (SortField)x;
            var result = await _validator.TestValidateAsync(_model);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.Sort);
        }

        [Theory]
        [InlineData(-2)]
        [InlineData(-1)]
        [InlineData(4)]
        [InlineData(5)]
        public async Task SortIntValidationShouldReturnError(int x)
        {
            _model.Sort = (SortField)x;
            var result = await _validator.TestValidateAsync(_model);

            result.Should().NotBeNull();
            result.Errors.Should().NotBeEmpty();
            result.ShouldHaveValidationErrorFor(x => x.Sort);
        }

        internal class ValidSortStringValues : TheoryData<string>
        {
    
            public ValidSortStringValues()
            {
                foreach (string s in Enum.GetNames<SortField>())
                {
                    Add(s);
                    Add(s.ToUpperInvariant());
                    Add(s.ToLowerInvariant());
                }
            }
        };

        [Theory]
        [ClassData(typeof(ValidSortStringValues))]
        public async Task SortStringValidationShouldReturnNoErrors(string s)
        {
            _model.Sort = Enum.Parse<SortField>(s, true);
            var result = await _validator.TestValidateAsync(_model);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.Sort);
        }

        [Theory]
        [InlineData("")]
        [InlineData(" ")]
        [InlineData("x")]
        public void InvalidStringSortValidationShouldReturnError(string s)
        {
            var result = Enum.TryParse<SortField>(s, true, out _);
            result.Should().BeFalse();
        }
    }
}
