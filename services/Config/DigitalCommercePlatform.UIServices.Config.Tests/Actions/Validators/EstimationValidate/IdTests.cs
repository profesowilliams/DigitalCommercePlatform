using DigitalCommercePlatform.UIServices.Config.Tests.Utils;
using DigitalCommercePlatform.UIServices.Config.Tests.Utils.Factories;
using FluentAssertions;
using System.Threading.Tasks;
using Xunit;
using FluentValidation.TestHelper;
using EV = DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.Validators.EstimationValidate
{
    public class IdTests
    {
        internal class ValidIdData : TheoryData<EV.EstimationValidate.Request>
        {
            public ValidIdData()
            {
                Add(new EV.EstimationValidate.Request(FindModelFactory.CreateValid()));
                Add(new EV.EstimationValidate.Request(FindModelFactory.CreateValid(2)));
                Add(new EV.EstimationValidate.Request(FindModelFactory.CreateValid(255)));
            }
        }

        [Theory]
        [ClassData(typeof(ValidIdData))]
        public async Task IdValidationShouldReturnNoErrors(EV.EstimationValidate.Request request)
        {
            var validator = GetValidator();
            var result = await validator.TestValidateAsync(request);

            result.Should().NotBeNull();
            result.ShouldNotHaveAnyValidationErrors();
        }

        internal class InvalidIdData : TheoryData<EV.EstimationValidate.Request>
        {
            protected static readonly string ValidChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            protected static readonly string InvalidChars = " @%";

            protected static readonly int Min = EV.EstimationValidate.Validator.MinIdLength;
            protected static readonly int Max = EV.EstimationValidate.Validator.MaxIdLength;

            
            public InvalidIdData()
            {
                var criteria = FindModelFactory.CreateValid();
                criteria.Id = GenerateInvalidId(Max + 1);

                Add(new EV.EstimationValidate.Request (criteria));
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
            var validator = GetValidator();
            var result = await validator.TestValidateAsync(request);

            result.Should().NotBeNull();
            result.IsValid.Should().BeFalse();
            result.Errors.Should().NotBeEmpty();
            result.ShouldHaveValidationErrorFor(x => x.Criteria.Id);
        }

        private static EV.EstimationValidate.Validator GetValidator()
        {
            return new EV.EstimationValidate.Validator();
        }
    }
}
