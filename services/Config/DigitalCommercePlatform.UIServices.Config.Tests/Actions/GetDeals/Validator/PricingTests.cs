using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using FluentAssertions;
using FluentValidation.TestHelper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;
using GRD = DigitalCommercePlatform.UIServices.Config.Actions.GetRecentDeals;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.GetDeals.Validator
{
    public class PricingTests : GetDealsValidatorTestsBase
    {
        private readonly GRD.GetDeals.Validator _validator;
        private readonly FindModel _model;

        public PricingTests()
        {
            _validator = GetValidator();
            _model = GetValidModel();
        }

        internal class ValidPricingValues : TheoryData<int>
        {
            public ValidPricingValues()
            {
                for (int i = 0; i < 9; i++)
                {
                    AddRow(i);
                }
                AddRow(11);
            }
        };

        [Theory]
        [ClassData(typeof(ValidPricingValues))]
        public async Task PricingIntValidationShouldReturnNoErrors(int x)
        {
            _model.Pricing = (PricingCondition)x;
            var result = await _validator.TestValidateAsync(_model);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.Pricing);
        }

        [Theory]
        [InlineData(-2)]
        [InlineData(-1)]
        [InlineData(9)]
        [InlineData(10)]
        [InlineData(12)]
        [InlineData(255)]
        public async Task PricingIntValidationShouldReturnError(int x)
        {
            _model.Pricing = (PricingCondition)x;
            var result = await _validator.TestValidateAsync(_model);

            result.Should().NotBeNull();
            result.Errors.Should().NotBeEmpty();
            result.ShouldHaveValidationErrorFor(x => x.Pricing);
        }

        public static IEnumerable<object[]> ValidPricingNames => new List<object[]>
        {
            new object[] { "Commercial" },
            new object[] { "EducationStudentStaff" },
            new object[] { "EducationHigher" },
            new object[] { "EducationK12" },
            new object[] { "EducationERateK12" },
            new object[] { "Federal" },
            new object[] { "FederalGSA" },
            new object[] { "State" },
            new object[] { "Medical" },
            new object[] { "SEWPContract" }
        };

        [Theory]
        [MemberData(nameof(ValidPricingNames))]
        public async Task PricingStringValidationShouldReturnNoErrors(string s)
        {
            _model.Pricing = Enum.Parse<PricingCondition>(s);
            var result = await _validator.TestValidateAsync(_model);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.Pricing);
        }

        [Theory]
        [InlineData("x")]
        [InlineData("abc")]
        [InlineData("commercial")]
        [InlineData("state")]
        public async Task PricingStringValidationShouldReturnNull(string s)
        {
            var names = Enum.GetNames(typeof(PricingCondition)).ToList();
            _model.Pricing = names.Contains(s)
                ? Enum.Parse<PricingCondition>(s)
                : null;
            var result = await _validator.TestValidateAsync(_model);

            _model.Pricing.Should().BeNull();
            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.Pricing);
            
        }
    }
}
