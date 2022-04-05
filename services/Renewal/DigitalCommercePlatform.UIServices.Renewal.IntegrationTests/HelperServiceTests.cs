//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals.Internal;
using DigitalCommercePlatform.UIServices.Renewal.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Providers.Settings;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Renewal.IntegrationTests
{
    public class HelperServiceTests
    {
        private readonly Mock<ILogger<HelperService>> _logger;
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<IAppSettings> _appSettings;
        public HelperServiceTests()
        {
            _logger = new Mock<ILogger<HelperService>>();
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _appSettings = new Mock<IAppSettings>();
        }

        private HelperService GetHelperService()
        {
            return new HelperService(_logger.Object, _middleTierHttpClient.Object, _appSettings.Object);
        }

        [Fact]
        public void PopulateLinesFor_Test()
        {
            //arrange
            ItemModel testLine = new()
            {
                Quantity = 1,
                Manufacturer = "CISCO",
                MFRNumber = "C9200-NM-4X",
                TDNumber = "13517170"
            };

            List<ItemModel> lstItems = new() { testLine };
            //Act
            var result = GetHelperService().PopulateLinesFor(lstItems, "Cisco");
            Assert.NotNull(result);
        }

        [Fact]
        public void GetVendorLogo_Test()
        {
            //arrange
            _appSettings.Setup(x => x.TryGetSetting<Dictionary<string, string>>("UI.Renewals.VendorLogos"))
                .Returns(new Dictionary<string, string>() {
                    { "testvendor", "http://testVendor/logoUrl.svg" }
                });

            //Act
            var result = GetHelperService().GetVendorLogo("TestVendor");
            Assert.NotNull(result);
            Assert.Equal("http://testVendor/logoUrl.svg", result);

            result = GetHelperService().GetVendorLogo("Testvendor");
            Assert.NotNull(result);
            Assert.Equal("http://testVendor/logoUrl.svg", result);

            result = GetHelperService().GetVendorLogo("AnotherVendor");
            Assert.NotNull(result);
            Assert.Equal(string.Empty, result);
        }

        [Fact]
        public void GetVendorLogo_TestException()
        {
            //arrange
            _appSettings.Setup(x => x.TryGetSetting("UI.Renewals.VendorLogos")).Returns<string>(null);

            //Act
            var result = GetHelperService().GetVendorLogo("TestVendor");
            Assert.NotNull(result);
            Assert.Equal(string.Empty, result);
        }
    }
}
