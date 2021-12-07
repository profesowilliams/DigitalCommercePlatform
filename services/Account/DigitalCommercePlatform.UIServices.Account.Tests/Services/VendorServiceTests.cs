//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Providers.Settings;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using Xunit;


namespace DigitalCommercePlatform.UIServices.Account.Tests.Services
{
    public class VendorServiceTests
    {
        private readonly IVendorService _vendorService;
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<ILogger<VendorService>> _logger;
        private readonly Mock<IUIContext> _uiContext;
        private readonly Mock<IAppSettings> _appSettings;

        public VendorServiceTests()
        {
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _logger = new Mock<ILogger<VendorService>>();
            _appSettings = new Mock<IAppSettings>();
            _appSettings.Setup(s => s.GetSetting("Core.Security.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/core-security/v1");
            _uiContext = new Mock<IUIContext>();

            _vendorService = new VendorService(_middleTierHttpClient.Object,
                _appSettings.Object,
                _logger.Object,
                _uiContext.Object
                );
        }

        [Fact]
        public void VendorList_Test()
        {
            //arrange

            Type type;
            object objType;
            InitiatVendorServiceTests(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "VendorList" && x.IsPrivate);

            //Act
            var result = imageProductModel.Invoke(objType, new object[] { });
            Assert.NotNull(result);
        }

        [Fact]
        public void BuildVendorListResponse_Test()
        {
            //arrange
            var request = new List<string> { "cisco" };

            Type type;
            object objType;
            InitiatVendorServiceTests(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "BuildVendorListResponse" && x.IsPrivate);

            //Act
            var result = imageProductModel.Invoke(objType, new object[] { request });
            Assert.NotNull(result);
        }

        private void InitiatVendorServiceTests(out Type type, out object objType)
        {
            type = typeof(VendorService);
            objType = Activator.CreateInstance(type,
                _middleTierHttpClient.Object,
                _appSettings.Object,
                _logger.Object,
                _uiContext.Object
                );
        }
    }
}
