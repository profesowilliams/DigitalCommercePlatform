//2022 (c) Tech Data Corporation - All Rights Reserved.
using DigitalCommercePlatform.UIServices.Browse.Actions.GetStock;
using DigitalCommercePlatform.UIServices.Browse.Controllers;
using DigitalCommercePlatform.UIServices.Browse.Models.Stock;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Net;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Controllers
{
    public class StockControllerTests
    {
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<IUIContext> _context;
        private readonly Mock<ILogger<StockController>> _logger;
        private readonly Mock<IMediator> _mediator;
        private readonly Mock<ISiteSettings> _siteSettings;

        public StockControllerTests()
        {
            _mediator = new Mock<IMediator>();
            _context = new Mock<IUIContext>();
            _logger = new Mock<ILogger<StockController>>();

            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("LocalizationList")).Returns("en-US");

            _siteSettings = new Mock<ISiteSettings>();
            _siteSettings.Setup(s => s.TryGetSetting("SalesOrg")).Returns("WW_ORG");

            _context.SetupGet(x => x.Language).Returns("en-us");
        }

        [Fact]
        public void AllMethodsAuthCheck()
        {
            //Arrange
            var methods = typeof(StockController).GetTypeInfo().GetMethods();

            foreach (var m in methods)
            {
                //Act
                var annonymousAttribute = m.GetCustomAttribute<AllowAnonymousAttribute>();

                //Assert
                annonymousAttribute.Should().BeNull();
            }
        }

        [Theory]
        [AutoDomainData]
        public async Task GetStock_Check400WithoutBody(string id, string someProperty)
        {
            //arrange
            dynamic details = new
            {
                SomeProperty = someProperty
            };
            _mediator.Setup(x => x.Send(It.IsAny<GetStockHandler.Request>(), It.IsAny<CancellationToken>()))
                .ThrowsAsync(new RemoteServerHttpException(null, statusCode: HttpStatusCode.BadRequest, details))
                .Verifiable();

            using var sut = new StockController(_mediator.Object, _logger.Object, _context.Object, _appSettingsMock.Object, _siteSettings.Object);

            //act
            var result = await sut.GetStock(id).ConfigureAwait(false);

            //assert
            _mediator.Verify();
            result.Should().NotBeNull();
            result.Should().BeOfType<ObjectResult>();
            ((ObjectResult)result).StatusCode.Should().Be(400);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetStock_Check404(string id)
        {
            //arrange
            _mediator.Setup(x => x.Send(It.IsAny<GetStockHandler.Request>(), It.IsAny<CancellationToken>()))
                .ThrowsAsync(new RemoteServerHttpException(null, statusCode: HttpStatusCode.NotFound, null))
                .Verifiable();
            using var sut = new StockController(_mediator.Object, _logger.Object, _context.Object, _appSettingsMock.Object, _siteSettings.Object);

            //act
            var result = await sut.GetStock(id).ConfigureAwait(false);

            //assert
            _mediator.Verify();
            result.Should().NotBeNull();
            result.Should().BeOfType<ObjectResult>();
            ((ObjectResult)result).StatusCode.Should().Be(404);
        }

        [Theory]
        [InlineData(null, "44")]
        [InlineData("", "44")]
        [InlineData("  ", "44")]
        [InlineData("some body", "44")]
        public async Task GetStock_Check404WithBody(string body, string id)
        {
            //arrange
            dynamic details = new
            {
                Body = body
            };
            _mediator.Setup(x => x.Send(It.IsAny<GetStockHandler.Request>(), It.IsAny<CancellationToken>()))
                .ThrowsAsync(new RemoteServerHttpException(null, statusCode: HttpStatusCode.NotFound, details))
                .Verifiable();

            using var sut = new StockController(_mediator.Object, _logger.Object, _context.Object, _appSettingsMock.Object, _siteSettings.Object);

            //act
            var result = await sut.GetStock(id).ConfigureAwait(false);

            //assert
            _mediator.Verify();
            result.Should().NotBeNull();
            result.Should().BeOfType<ObjectResult>();
            ((ObjectResult)result).StatusCode.Should().Be(404);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetStock_Check500(string id)
        {
            //arrange
            _mediator.Setup(x => x.Send(It.IsAny<GetStockHandler.Request>(), It.IsAny<CancellationToken>()))
                .ThrowsAsync(new Exception())
                .Verifiable();
            using var sut = new StockController(_mediator.Object, _logger.Object, _context.Object, _appSettingsMock.Object, _siteSettings.Object);

            //act
            var result = await sut.GetStock(id).ConfigureAwait(false);

            //assert
            _mediator.Verify();
            result.Should().NotBeNull();
            result.Should().BeOfType<StatusCodeResult>();
            ((StatusCodeResult)result).StatusCode.Should().Be(500);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetStockReturnsData(string id, StockModel stocks)
        {
            //Arrange
            _mediator.Setup(x => x.Send(It.IsAny<IRequest<StockModel>>(), It.IsAny<CancellationToken>()))
                .ReturnsAsync(stocks);

            using var controller = new StockController(_mediator.Object, _logger.Object, _context.Object, _appSettingsMock.Object, _siteSettings.Object);

            //Act
            var result = await controller.GetStock(id).ConfigureAwait(false);

            //Assert
            result.Should().BeOfType<OkObjectResult>();
            ((OkObjectResult)result).Value.Should().NotBeNull();
        }

        [Fact]
        public void StockControllerAuthCheck()
        {
            //Arrange
            var controllerInfo = typeof(StockController).GetTypeInfo();

            //Act
            var authorizeAttribute = controllerInfo.GetCustomAttribute<AuthorizeAttribute>();
            var annonymousAttribute = controllerInfo.GetCustomAttribute<AllowAnonymousAttribute>();

            //Assert
            authorizeAttribute.Should().NotBeNull();
            annonymousAttribute.Should().BeNull();
        }
    }
}