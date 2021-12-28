//2021 (c) Tech Data Corporation -. All Rights Reserved.
using FluentAssertions;
using FluentValidation.TestHelper;
using System.Threading.Tasks;
using Xunit;
using DQD = DigitalCommercePlatform.UIServices.Export.Actions.Quote.DownloadQuoteDetails;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Actions.Quote.DownloadQuoteDetails.Validator
{
    public class QuoteIdValidationTests
    {
        private readonly DQD.Validator _validator;

        public QuoteIdValidationTests()
        {
            _validator = new DQD.Validator();
        }

        [Fact]
        public async Task QuoteIdValidationShouldReturnNoErrors()
        {
            DQD.Request request = new()
            {
                QuoteId = "aw3"
            };
            var result = await _validator.TestValidateAsync(request);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.QuoteId);
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
                        QuoteId = s
                    });
                }
            }
        }

        [Theory]
        [ClassData(typeof(InvalidQuoteIdData))]
        public async Task QuoteIdValidationShouldReturnError(DQD.Request request)
        {
            var result = await _validator.TestValidateAsync(request);

            result.Should().NotBeNull();
            result.IsValid.Should().BeFalse();
            result.Errors.Should().NotBeEmpty();
            result.ShouldHaveValidationErrorFor(x => x.QuoteId);
        }
    }
}
