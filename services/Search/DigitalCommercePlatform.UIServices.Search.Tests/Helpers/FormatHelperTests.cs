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
        [AutoDomainData(nameof(IntData))]
        public void FormatInt_Tests(int input, string expected)
        {
            // arrange - act
            var result = input.Format();

            //assert
            result.Should().Be(expected);
        }

        [Theory]
        [AutoDomainData(nameof(SubtractionData))]
        public void FormatPromoAmount_Tests(decimal? minuend, decimal? subtrahend, string currency, string expected)
        {
            // arrange - act
            var result = FormatHelper.FormatSubtraction(minuend, subtrahend, currency);

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

        [Theory]
        [AutoDomainData(nameof(GetListPriceData))]
        public void GetListPriceFlagLisrPriceFalse_ResultWithPrice(decimal listPrice, string flag, bool listPriceAvailable, string currency, string expectedValue)
        {
            //act
            string result = FormatHelper.ListPriceFormat(listPrice, flag, listPriceAvailable, currency);

            //assert            
            result.Should().Be(expectedValue);
        }

        public static IEnumerable<object> GetListPriceData()
        {
            return new[]
            {
                new object[]
                {
                    null,
                    "NA",
                    true,
                    "PLN",
                    "0,00 zł"
                },
                new object[]
                {
                    null,
                    "NA",
                    false,
                    "PLN",
                    "NA"
                },
                new object[]
                {
                    192m,
                    "NA",
                    false,
                    "PLN",
                    "192,00 zł"
                },
                 new object[]
                {
                    192m,
                    "NA",
                    true,
                    "PLN",
                    "192,00 zł"
                },
            };
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

        public static IEnumerable<object> SubtractionData()
        {
            return new[]
            {
                new object[]
                {
                    null,
                    null,
                    null,
                    null
                },
                new object[]
                {
                    null,
                    44m,
                    null,
                    null
                },
                new object[]
                {
                    44m,
                    null,
                    "PLN",
                    null
                },
                new object[]
                {
                    0m,
                    0m,
                    "PLN",
                    "0,00 zł"
                },
                new object[]
                {
                    44m,
                    44m,
                    "PLN",
                    "0,00 zł"
                },
                new object[]
                {
                    44.44m,
                    44.44m,
                    "PLN",
                    "0,00 zł"
                },
                new object[]
                {
                    14444444.88m,
                    44.44m,
                    "PLN",
                    "14 444 400,44 zł"
                }
            };
        }

        [Theory]
        [AutoDomainData(nameof(GetCurrencyData))]
        public void CurrencyFormat_Results(decimal amount, string currencyCode, string expectedValue)
        {
            //act
            string result = amount.Format(currencyCode);

            //assert            
            result.Should().Be(expectedValue);
        }

        public static IEnumerable<object> GetCurrencyData()
        {
            return new[]
            {
                new object[]
                {
                    123.123m,
                    "USD",
                    "$123.12"
                },
                new object[]
                {
                    123.123m,
                    "PLN",
                    "123,12 zł"
                },
                new object[]
                {
                    192m,
                    "PLN",
                    "192,00 zł"
                },
                 new object[]
                {
                    192.15m,
                    "PLN",
                    "192,15 zł"
                },
            };
        }

        [Theory]
        [AutoDomainData(nameof(GetWrongCurrencyData))]
        public void CurrencyFormat_Exceptions(decimal amount, string currencyCode)
        {
            //act
            Action act = () => amount.Format(currencyCode);

            //assert            
            act.Should().Throw<ArgumentNullException>();
        }

        public static IEnumerable<object> GetWrongCurrencyData()
        {
            return new[]
            {
                    new object[]
                        {
                            123.123m,
                            "ABC"                           
                        },
                    new object[]
                    {
                        123.123m,
                        string.Empty,                        
                    },
                     new object[]
                    {
                        123.123m,
                        null                        
                    }

            };
        }
    }
}
