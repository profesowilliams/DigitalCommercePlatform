using DigitalCommercePlatform.UIService.Product.Actions.Product.FindProduct;
using DigitalCommercePlatform.UIService.Product.Actions.Product.FindSummarySearch;
using DigitalCommercePlatform.UIService.Product.Actions.Product.GetProductDetails;
using DigitalCommercePlatform.UIService.Product.Actions.Product.GetProductSummary;
using DigitalCommercePlatform.UIService.Product.Models.Find;
using DigitalCommercePlatform.UIService.Product.Models.Product.Internal;
using DigitalCommercePlatform.UIService.Product.Models.Summary;
using DigitalCommercePlatform.UIServices.Product.Controllers;
using DigitalCommercePlatform.UIServices.Product.Tests;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Moq;
using System.Collections.Generic;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Controllers
{

public class ProductControllerTest
    {
        private readonly Mock<IMediator> _mockMediator;
        private readonly Mock<ILogger<ProductController>> _mockLoggerFactory;
        private readonly Mock<IContext> _mockContext;
        private readonly Mock<IOptions<AppSettings>> _mockOptions;
        private readonly Mock<ISiteSettings> _mockSiteSettings;


        public ProductControllerTest()
        {
            _mockMediator = new Mock<IMediator>();
            _mockContext = new Mock<IContext>();
            _mockContext.SetupGet(x => x.Language).Returns("en-us");
            _mockLoggerFactory = new Mock<ILogger<ProductController>>();
            var appSettingsDict = new Dictionary<string, string>()
            {
                { "localizationlist", "en-US" },
                { "SalesOrg", "WW_ORG" }
            };

            var appSettings = new AppSettings();
            appSettings.Configure(appSettingsDict);

            var appSettingOptions = new Mock<IOptions<AppSettings>>();
            appSettingOptions.Setup(s => s.Value).Returns(appSettings);
            _mockOptions = appSettingOptions;

            _mockSiteSettings = new Mock<ISiteSettings>();
        }

        private ProductController GetController()
        {
            return new ProductController(_mockMediator.Object, _mockLoggerFactory.Object, _mockContext.Object,
                _mockOptions.Object, _mockSiteSettings.Object);
        }

        [Theory]
        [AutoMoqData]
        public async Task FindProductdetials(FindProductHandler.GetProductResponse expected)
        {
            var detailsInput = new FindProductModel()
            {
                MaterialNumber = new string[] { "123" },
                OldMaterialNumber = new string[] { "123" },
                Manufacturer = new string[] { "123" },
                MfrPartNumber = new string[] { "123" },
                UPC = new string[] { "123" },
                CustomerNumber = "123",
                CustomerPartNumber = "123",
                SalesOrganization = "123",
                MaterialStatus = new string[] { "123" },
                Territories = new string[] { "123" },
                Description = "123"
            };

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<FindProductHandler.GetProductRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.FindProduct(detailsInput, true,1,10,true).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoMoqData]
        public async Task FindSummarydetials(FindSummaryHandler.FindSummaryResponse expected)
        {
            var summaryInput = new FindProductModel()
            {
                MaterialNumber = new string[] { "123" },
                OldMaterialNumber = new string[] { "123" },
                Manufacturer = new string[] { "123" },
                MfrPartNumber = new string[] { "123" },
                UPC = new string[] { "123" },
                CustomerNumber = "123",
                CustomerPartNumber = "123",
                SalesOrganization = "123",
                MaterialStatus = new string[] { "123" },
                Territories = new string[] { "123" },
                Description = "123"
            };

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<FindSummaryHandler.FindSummaryRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.FindProduct(summaryInput, true, 1, 10,false).ConfigureAwait(false);

            result.Should().NotBeNull();
        }


        [Theory]
        [AutoMoqData]
        public async Task GetProductdetials(GetProductDetailsHandler.GetProductDetailsResponse expected)
        {
            var data = new List<string> { "123" };

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetProductDetailsHandler.GetProductDetailsRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.Get(data, true).ConfigureAwait(false);

            result.Should().NotBeNull();
        }


        [Theory]
        [AutoMoqData]
        public async Task GetProductSummary(GetProductSummaryHandler.GetProductSummaryResponse expected)
        {
            var data = new List<string> { "123" };

            _mockMediator.Setup(x => x.Send(
                       It.IsAny<GetProductSummaryHandler.GetProductSummaryRequest>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();

            var result = await controller.Get(data, false).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

    }
}