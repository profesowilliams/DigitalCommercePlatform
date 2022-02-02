//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Helpers;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Globalization;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Helpers
{
    public class FormatHelperTests
    {
        public FormatHelperTests()
        {
            CultureInfo.CurrentCulture = new CultureInfo("pl-PL");
        }

        public static IEnumerable<object> DateTimeData()
        {
            return new[]
            {
                new object[]
                {
                    null,
                    null
                },
                new object[]
                {
                    new DateTime(2022, 01, 26, 12, 58, 45, 999),
                    "26.01.2022 12:58:45"
                }
            };
        }

        public static IEnumerable<object> DecimalData()
        {
            return new[]
            {
                new object[]
                {
                    0m,
                    "0,00 zł",
                },
                new object[]
                {
                    44m,
                    "44,00 zł",
                },
                new object[]
                {
                    444444.44m,
                    "444 444,44 zł",
                }
            };
        }

        public static IEnumerable<object> IntData()
        {
            return new[]
            {
                new object[]
                {
                    0,
                    "0"
                },
                new object[]
                {
                    44,
                    "44",
                },
                new object[]
                {
                    444444,
                    "444 444"
                }
            };
        }

        public static IEnumerable<object> NullableDecimalData()
        {
            return new[]
            {
                new object[]
                {
                    null,
                    null,
                },
                new object[]
                {
                    0m,
                    "0,00 zł",
                },
                new object[]
                {
                    44m,
                    "44,00 zł",
                },
                new object[]
                {
                    444444.44m,
                    "444 444,44 zł",
                }
            };
        }

        public static IEnumerable<object> NullableIntData()
        {
            return new[]
            {
                new object[]
                {
                    null,
                    null
                },
                new object[]
                {
                    0,
                    "0"
                },
                new object[]
                {
                    44,
                    "44",
                },
                new object[]
                {
                    444444,
                    "444 444"
                }
            };
        }

        public static IEnumerable<object> SubtractionData()
        {
            return new[]
            {
                new object[]
                {
                    null,
                    null,
                    null
                },
                new object[]
                {
                    null,
                    44m,
                    null
                },
                new object[]
                {
                    44m,
                    null,
                    null
                },
                new object[]
                {
                    0m,
                    0m,
                    "0,00 zł"
                },
                new object[]
                {
                    44m,
                    44m,
                    "0,00 zł"
                },
                new object[]
                {
                    44.44m,
                    44.44m,
                    "0,00 zł"
                },
                new object[]
                {
                    14444444.88m,
                    44.44m,
                    "14 444 400,44 zł"
                }
            };
        }

        [Theory]
        [AutoDomainData(nameof(DateTimeData))]
        public void FormatDateTime_Tests(DateTime? input, string expected)
        {
            // arrange - act
            var result = input.Format();

            //assert
            result.Should().Be(expected);
        }

        [Theory]
        [AutoDomainData(nameof(DecimalData))]
        public void FormatDecimal_Tests(decimal input, string expected)
        {
            // arrange - act
            var result = input.Format();

            //assert
            result.Should().Be(expected);
        }

        [Theory]
        [AutoDomainData(nameof(IntData))]
        public void FormatInt_Tests(int input, string expected)
        {
            // arrange - act
            var result = input.Format();

            //assert
            result.Should().Be(expected);
        }

        [Theory]
        [AutoDomainData(nameof(NullableDecimalData))]
        public void FormatNullableDecimal_Tests(decimal? input, string expected)
        {
            // arrange - act
            var result = input.Format();

            //assert
            result.Should().Be(expected);
        }

        [Theory]
        [AutoDomainData(nameof(NullableIntData))]
        public void FormatNullableInt_Tests(int? input, string expected)
        {
            // arrange - act
            var result = input.Format();

            //assert
            result.Should().Be(expected);
        }

        [Theory]
        [AutoDomainData(nameof(SubtractionData))]
        public void FormatPromoAmount_Tests(decimal? minuend, decimal? subtrahend, string expected)
        {
            // arrange - act
            var result = FormatHelper.FormatSubtraction(minuend, subtrahend);

            //assert
            result.Should().Be(expected);
        }
    }
}
