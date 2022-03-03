//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using System.Globalization;
using System.Threading;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Services
{
    public class PriceServiceTests
    {
        public PriceServiceTests()
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("en-US");
        }

        [Theory]
        [AutoDomainData]
        public void GetListPriceFlagLisrPriceTrue_ResultWithPrice(decimal listPrice)
        {
            //act
            string result = _sut.GetListPrice(listPrice, "NA", true);

            //assert
            var parsetString = listPrice.ToString("0.00");
            result.Should().Be("$" + parsetString);
        }

        [Theory]
        [AutoDomainData]
        public void GetListPriceFlagLisrPriceFalse_ResultWithPrice(decimal listPrice)
        {
            //act
            string result = _sut.GetListPrice(listPrice, "NA", false);

            //assert
            var parsetString = listPrice.ToString("0.00");
            result.Should().Be("$" + parsetString);
        }

        [Fact]        
        public void GetListPriceFlagLisrPriceTrue_ResultZero()
        {
            //act
            string result = _sut.GetListPrice(null, "NA", true);

            //assert
            result.Should().Be("$0.00");
        }

        [Fact]
        public void GetListPriceFlagLisrPriceFalse_ResultNA()
        {
            //act
            string result = _sut.GetListPrice(null, "NA", false);

            //assert
            result.Should().Be("NA");
        }


        private static PriceService _sut => new();

    }
}
