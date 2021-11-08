//2021 (c) Tech Data Corporation -. All Rights Reserved.
using FluentAssertions;
using System.Threading.Tasks;
using Xunit;
using FluentValidation.TestHelper;
using DI = DigitalCommercePlatform.UIServices.Commerce.Actions.Order.DownloadInvoice;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Actions.Order.DownloadInvoice.Validator
{
    public class OrderIdTests
    {
        private readonly DI.Validator _validator;

        public OrderIdTests()
        {
            _validator = new DI.Validator();
        }

        internal class ValidOrderIdData : TheoryData<DI.Request>
        {
            public ValidOrderIdData()
            {
                Add(new DI.Request() { OrderId = "a" });
                Add(new DI.Request() { OrderId = "12" });
                Add(new DI.Request() { OrderId = "asd!3" });
            }
        }

        [Theory]
        [ClassData(typeof(ValidOrderIdData))]
        public async Task OrderIdValidationShouldReturnNoErrors(DI.Request request)
        {
            var result = await _validator.TestValidateAsync(request);

            result.Should().NotBeNull();
            result.ShouldNotHaveValidationErrorFor(x => x.OrderId);
        }

        internal class InvalidIdData : TheoryData<DI.Request>
        {
            public InvalidIdData()
            {
                var invalidOrderIds = new string[] { 
                    null, string.Empty, "", " ", "    " 
                };

                foreach (string s in invalidOrderIds)
                {
                    Add(new DI.Request() { OrderId = s });
                }
            }
        }

        [Theory]
        [ClassData(typeof(InvalidIdData))]
        public async Task OrderIdValidationShouldReturnError(DI.Request request)
        {
            var result = await _validator.TestValidateAsync(request);

            result.Should().NotBeNull();
            result.IsValid.Should().BeFalse();
            result.Errors.Should().NotBeEmpty();
            result.ShouldHaveValidationErrorFor(x => x.OrderId);
        }
    }
}
