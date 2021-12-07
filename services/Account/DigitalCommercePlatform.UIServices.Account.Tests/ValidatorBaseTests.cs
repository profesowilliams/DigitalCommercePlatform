//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation.TestHelper;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests
{
    public class ValidatorBaseTests
    {
        public class TestRequest : RequestBase
        {
            public TestRequest(string accessToken) : base(accessToken)
            { }
        }

        [Fact]
        public void Validator_EmptyAccessToken_HasError()
        {
            var request = new TestRequest(string.Empty);
            var result = new ValidatorBase<TestRequest>().TestValidate(request);
            result.ShouldHaveValidationErrorFor(d => d.AccessToken);
        }

        [Fact]
        public void Validator_NullAccessToken_HasError()
        {
            var request = new TestRequest(null);
            var result = new ValidatorBase<TestRequest>().TestValidate(request);
            result.ShouldHaveValidationErrorFor(d => d.AccessToken);
        }

        [Fact]
        public void Validator_OneCharAccessToken_HasError()
        {
            var request = new TestRequest("1");
            var result = new ValidatorBase<TestRequest>().TestValidate(request);
            result.ShouldHaveValidationErrorFor(d => d.AccessToken);
        }

        [Fact]
        public void Validator_AtLeastTwoCharsAccessToken_HasError4()
        {
            var request = new TestRequest("xx");
            var result = new ValidatorBase<TestRequest>().TestValidate(request);
            result.ShouldNotHaveValidationErrorFor(d => d.AccessToken);
        }
    }
}
