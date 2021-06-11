using FluentAssertions;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading.Tasks;
using Xunit;
using DigitalCommercePlatform.UIServices.Config.Tests.Utils;
using EV = DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.Validators
{
    [ExcludeFromCodeCoverage]
    public class IdTests
    {
        internal class ValidIdData : TheoryData<EV.EstimationValidate.Request>
        {
            protected static readonly string ValidChars = EV.EstimationValidate.Validator.ValidChars;
            protected static readonly int Min = EV.EstimationValidate.Validator.MinIdLength;
            protected static readonly int Max = EV.EstimationValidate.Validator.MaxIdLength;

            public ValidIdData()
            {
                Add(new EV.EstimationValidate.Request { Id = GenerateValidId(Min) });
                Add(new EV.EstimationValidate.Request
                {
                    Id = GenerateValidId((int)Math.Floor(0.5 * (Min + Max)))
                });
                Add(new EV.EstimationValidate.Request { Id = GenerateValidId(Max) });
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
            result.IsValid.Should().BeTrue();
            result.Errors.Should().BeEmpty();
        }

        internal class InvalidIdData : TheoryData<EV.EstimationValidate.Request>
        {
            protected static readonly string ValidChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            protected static readonly string InvalidChars = " @%";

            protected static readonly int Min = EV.EstimationValidate.Validator.MinIdLength;
            protected static readonly int Max = EV.EstimationValidate.Validator.MaxIdLength;

            public InvalidIdData()
            {
                Add(new EV.EstimationValidate.Request { Id = string.Empty });
                Add(new EV.EstimationValidate.Request
                {
                    Id = GenerateInvalidId(Min < 1 ? 0 : Min - 1)
                });
                Add(new EV.EstimationValidate.Request { Id = GenerateInvalidId(Max + 1) });

                foreach(char c in InvalidChars)
                {
                    Add(new EV.EstimationValidate.Request
                    {
                        Id = GenerateInvalidId((int)Math.Floor(0.5 * (Min + Max)), c)
                    });
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
