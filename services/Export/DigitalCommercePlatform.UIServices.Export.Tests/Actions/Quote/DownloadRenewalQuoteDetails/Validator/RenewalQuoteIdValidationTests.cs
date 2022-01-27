//2022 (c) Tech Data Corporation -. All Rights Reserved.
using FluentAssertions;
using FluentValidation.TestHelper;
using System.Threading.Tasks;
using Xunit;
using DQD = DigitalCommercePlatform.UIServices.Export.Actions.Quote.DownloadRenewalQuoteDetails;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Actions.Quote.DownloadRenewalQuoteDetails.Validator
{
    public class RenewalQuoteIdValidationTests
    {
        private readonly DQD.Validator _validator;

        public RenewalQuoteIdValidationTests()
        {
            _validator = new DQD.Validator();
        }

        [Fact]
        public async Task RenewalQuoteIdValidationShouldReturnNoErrors()
        {
            DQD.Request request = new()
            {
                Id = "aw3"
            };
            var result = await _validator.TestValidateAsync(request);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.Id);
        }

        internal class InvalidQuoteIdData : TheoryData<DQD.Request>
        {
            public InvalidQuoteIdData()
            {
                string[] invalidValues = { null, string.Empty, " ", "    " };

                foreach (string s in invalidValues)
                {
                    Add(new DQD.Request()
                    {
                        Id = s
                    });
                }
            }
        }

        [Theory]
        [ClassData(typeof(InvalidQuoteIdData))]
        public async Task RenewalQuoteIdValidationShouldReturnError(DQD.Request request)
        {
            var result = await _validator.TestValidateAsync(request);

            result.Should().NotBeNull();
            result.IsValid.Should().BeFalse();
            result.Errors.Should().NotBeEmpty();
            result.ShouldHaveValidationErrorFor(x => x.Id);
        }
    }
}
