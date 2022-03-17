//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalFoundation.Common.TestUtilities;
using FluentValidation.TestHelper;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions
{
    public class ProductDetailsValidationTests
    {
        public static IEnumerable<object> ProductDetailsValidations_ReturnInvalid_Data()
        {
            return new[]
            {
                new object[]
                {
                    new GetProductDetailsHandler.Request
                    (
                        null,
                        "0100",
                        "US",
                        "en-US",
                        ""
                    ),
                    "Id"
                },
                new object[]
                {
                    new GetProductDetailsHandler.Request
                    (
                        Array.Empty<string>(),
                        "0100",
                        "US",
                        "en-US",
                        ""
                    ),
                    "Id"
                },
                new object[]
                {
                    new GetProductDetailsHandler.Request
                    (
                        new string[]{"1" },
                        null,
                        "US",
                        "en-US",
                        ""
                    ),
                    "SalesOrg"
                },
                new object[]
                {
                    new GetProductDetailsHandler.Request
                    (
                        new string[]{"1" },
                        "",
                        "US",
                        "en-US",
                        ""
                    ),
                    "SalesOrg"
                },
                new object[]
                {
                    new GetProductDetailsHandler.Request
                    (
                        new string[]{"1" },
                        "0100",
                        "",
                        "",
                        ""
                    ),
                    "Site"
                },
                new object[]
                {
                    new GetProductDetailsHandler.Request
                    (
                        new string[]{"1" },
                        "0100",
                        null,
                        null,
                        ""
                    ),
                    "Site"
                }
            };
        }

        [Theory]
        [AutoDomainData]
        public async Task ProductDetailsValidations(GetProductDetailsHandler.Request request)
        {
            var validator = new GetProductDetailsHandler.Validator();
            var result = await validator.TestValidateAsync(request);

            result.ShouldNotHaveAnyValidationErrors();
        }

        [Theory]
        [AutoDomainData(nameof(ProductDetailsValidations_ReturnInvalid_Data))]
        public async Task ProductDetailsValidations_ReturnInvalid(GetProductDetailsHandler.Request request, string errorProperty)
        {
            var validator = new GetProductDetailsHandler.Validator();
            var result = await validator.TestValidateAsync(request);

            result.ShouldHaveValidationErrorFor(errorProperty);
        }
    }
}