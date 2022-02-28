//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCatalogDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductDetails;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetProductVariant;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetRelatedProducts;
using DigitalCommercePlatform.UIServices.Browse.Controllers;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalog;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Features.Contexts.Models;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Controllers
{
    public class BrowseControllerTests
    {
        private readonly Mock<IMediator> mockMediator;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<ILogger<BrowseController>> mockLoggerFactory;
        private readonly Mock<IUIContext> mockContext;
        private readonly Mock<ISiteSettings> mockSiteSettings;

        public BrowseControllerTests()
        {
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("LocalizationList")).Returns("en-US");

            mockMediator = new Mock<IMediator>();

            mockLoggerFactory = new Mock<ILogger<BrowseController>>();
            mockContext = new Mock<IUIContext>();

            var user = new User
            {
                ActiveCustomer = new Customer
                {
                    CustomerNumber = "cust",
                    System = "2",
                    SalesDivision = new List<SalesDivision>
                    {
                        new SalesDivision
                        {
                            SalesOrg="0100"
                        }
                    }
                }
            };

            mockContext.Setup(x => x.User).Returns(user);

            mockContext.SetupGet(x => x.Language).Returns("en-us");
            mockSiteSettings = new Mock<ISiteSettings>();

            mockSiteSettings.Setup(x => x.TryGetSetting<List<SalesOrg>>("SalesOrg")).Returns(new List<SalesOrg> { new SalesOrg { System = "2", Value = "0100" } });
        }

        private BrowseController GetController()
        {
            return new BrowseController(mockMediator.Object, mockLoggerFactory.Object, mockContext.Object,
                _appSettingsMock.Object, mockSiteSettings.Object);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductDetails(GetProductDetailsHandler.Response expected)
        {
            var data = new List<string> { "123" };

            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetProductDetailsHandler.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);
            var controller = GetController();
            var result = await controller.GetProduct(data).ConfigureAwait(false);

            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetRelatedProducts(ResponseBase<GetRelatedProductsHandler.Response> expected)
        {
            var ids = new string[] { "123" };
            var sameManufacturerOnly = false;

            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetRelatedProductsHandler.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var result = await controller.RelatedProducts(ids, sameManufacturerOnly).ConfigureAwait(false);
            result.Should().NotBeNull();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductCatalogService(ResponseBase<GetProductCatalogHandler.Response> expected, ProductCatalogRequest model)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetProductCatalogHandler.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var result = await controller.GetProductCatalog(model).ConfigureAwait(false);
            result.Should().NotBeNull();
        }       

        [Theory]
        [AutoDomainData]
        public async Task GetProductCatalogService_BadRequest(ResponseBase<GetProductCatalogHandler.Response> expected, ProductCatalogRequest model)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetProductCatalogHandler.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var result = await controller.GetProductCatalog(model).ConfigureAwait(false);
            result.Should().Equals(HttpStatusCode.BadRequest);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetProductVariants(GetProductVariantHandler.Response expected, string id)
        {
            mockMediator.Setup(x => x.Send(
                       It.IsAny<GetProductVariantHandler.Request>(),
                       It.IsAny<CancellationToken>()))
                   .ReturnsAsync(expected);

            var controller = GetController();
            var result = await controller.GetProductVariant(id).ConfigureAwait(false);
            result.Should().NotBeNull();
        }
    }
}