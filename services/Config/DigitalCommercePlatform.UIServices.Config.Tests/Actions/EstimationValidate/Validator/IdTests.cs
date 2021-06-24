using DigitalCommercePlatform.UIServices.Config.Tests.Common;
using DigitalCommercePlatform.UIServices.Config.Tests.Common.Factories;
using FluentAssertions;
using System.Threading.Tasks;
using Xunit;
using FluentValidation.TestHelper;
using EV = DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.EstimationValidate.Validator
{
    public class IdTests
    {
        protected static readonly int Min = EV.EstimationValidate.Validator.MinIdLength;
        protected static readonly int Max = EV.EstimationValidate.Validator.MaxIdLength;

        private readonly EV.EstimationValidate.Validator _validator;

        public IdTests()
        {
            _validator = new EV.EstimationValidate.Validator();
        }

        internal class ValidIdData : TheoryData<EV.EstimationValidate.Request>
        {
            public ValidIdData()
            {
                Add(new EV.EstimationValidate.Request(FindModelFactory.CreateValid()));
                Add(new EV.EstimationValidate.Request(FindModelFactory.CreateValid(Min)));
                Add(new EV.EstimationValidate.Request(FindModelFactory.CreateValid(Max)));
            }
        }

        [Theory]
        [ClassData(typeof(ValidIdData))]
        public async Task IdValidationShouldReturnNoErrors(EV.EstimationValidate.Request request)
        {
            var result = await _validator.TestValidateAsync(request);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.Criteria.Id);
        }

        internal class InvalidIdData : TheoryData<EV.EstimationValidate.Request>
        {
            protected static readonly string ValidChars = EV.EstimationValidate.Validator.ValidChars;
            protected static readonly string InvalidChars = " @%";
            
            public InvalidIdData()
            {
                var c1 = FindModelFactory.CreateValid();
                c1.Id = GenerateInvalidId(Max + 1);
                Add(new EV.EstimationValidate.Request(c1));

                var c2 = FindModelFactory.CreateValid();
                c2.Id = "";
                Add(new EV.EstimationValidate.Request(c2));

                foreach (char c in InvalidChars)
                {
                    var crit = FindModelFactory.CreateValid();
                    crit.Id = GenerateInvalidId(Max, c);
                    Add(new EV.EstimationValidate.Request(crit));
                }
            }

            private static string GenerateInvalidId(int length, char? invalidChar = null)
            {
                var result = StringUtils.GenerateRandomString(length, ValidChars);
                if (invalidChar.HasValue)
                {
                    result = result.Replace(result[0], invalidChar.Value);
                }
                return result;
            }
        }

        [Theory]
        [ClassData(typeof(InvalidIdData))]
        public async Task IdValidationShouldReturnErrors(EV.EstimationValidate.Request request)
        {
            var result = await _validator.TestValidateAsync(request);

            result.Should().NotBeNull();
            result.IsValid.Should().BeFalse();
            result.Errors.Should().NotBeEmpty();
            result.ShouldHaveValidationErrorFor(x => x.Criteria.Id);
        }
    }
}
