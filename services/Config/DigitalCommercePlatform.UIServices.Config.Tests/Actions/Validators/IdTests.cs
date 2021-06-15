using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Tests.Utils;
using FluentAssertions;
using System;
using System.Threading.Tasks;
using Xunit;
using EV = DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.Validators
{
    public class IdTests
    {
        internal class ValidIdData : TheoryData<EV.EstimationValidate.Request>
        {
            protected static readonly string ValidChars = EV.EstimationValidate.Validator.ValidChars;
            protected static readonly int Min = EV.EstimationValidate.Validator.MinIdLength;
            protected static readonly int Max = EV.EstimationValidate.Validator.MaxIdLength;

            public ValidIdData()
            {                
                var criteria = new FindModel
                {
                    Id = GenerateValidId((int)Math.Floor(0.5 * (Min + Max)))
                };
                Add(new EV.EstimationValidate.Request());
                Add(new EV.EstimationValidate.Request(criteria));
            }

            private static string GenerateValidId(int length)
            {
                var result = StringUtils.GenerateRandomString(length, ValidChars);
                return result;
            }
        }

        [Theory]
        [ClassData(typeof(ValidIdData))]
        public async Task IsValidShouldBeTrue(EV.EstimationValidate.Request request)
        {
            var validator = GetValidator();
            var result = await validator.ValidateAsync(request);

            result.Should().NotBeNull();            
        }

        internal class InvalidIdData : TheoryData<EV.EstimationValidate.Request>
        {
            protected static readonly string ValidChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            protected static readonly string InvalidChars = " @%";

            protected static readonly int Min = EV.EstimationValidate.Validator.MinIdLength;
            protected static readonly int Max = EV.EstimationValidate.Validator.MaxIdLength;

            
            public InvalidIdData()
            {
                var criteria = new FindModel
                {
                    Id = GenerateInvalidId(Max + 1)
                };

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
        public async Task IsValidShouldBeFalse(EV.EstimationValidate.Request request)
        {
            var validator = GetValidator();
            var result = await validator.ValidateAsync(request);

            result.Should().NotBeNull();
            result.IsValid.Should().BeFalse();
            result.Errors.Should().NotBeEmpty();
        }

        private static EV.EstimationValidate.Validator GetValidator()
        {
            return new EV.EstimationValidate.Validator();
        }
    }
}
