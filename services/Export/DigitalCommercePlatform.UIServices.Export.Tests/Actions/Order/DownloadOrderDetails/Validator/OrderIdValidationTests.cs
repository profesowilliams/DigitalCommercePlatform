//2021 (c) Tech Data Corporation -. All Rights Reserved.
using FluentAssertions;
using FluentValidation.TestHelper;
using System.Threading.Tasks;
using Xunit;
using DOD = DigitalCommercePlatform.UIServices.Export.Actions.Order.DownloadOrderDetails;

namespace DigitalCommercePlatform.UIServices.Export.Tests.Actions.Order.DownloadOrderDetails.Validator
{
    public class OrderIdValidationTests
    {
        private readonly DOD.Validator _validator;

        public OrderIdValidationTests()
        {
            _validator = new DOD.Validator();
        }

        [Fact]
        public async Task OrderIdValidationShouldReturnNoErrors()
        {
            DOD.Request request = new()
            {
                OrderId = "aw3"
            };
            var result = await _validator.TestValidateAsync(request);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.OrderId);
        }

        internal class InvalidOrderIdData : TheoryData<DOD.Request>
        {
            public InvalidOrderIdData()
            {
                string[] invalidValues = { null, string.Empty, " ", "    " };

                foreach (string s in invalidValues)
                {
                    Add(new DOD.Request()
                    {
                        OrderId = s
                    });
                }
            }
        }

        [Theory]
        [ClassData(typeof(InvalidOrderIdData))]
        public async Task OrderIdValidationShouldReturnError(DOD.Request request)
        {
            var result = await _validator.TestValidateAsync(request);

            result.Should().NotBeNull();
            result.IsValid.Should().BeFalse();
            result.Errors.Should().NotBeEmpty();
            result.ShouldHaveValidationErrorFor(x => x.OrderId);
        }
    }
}
