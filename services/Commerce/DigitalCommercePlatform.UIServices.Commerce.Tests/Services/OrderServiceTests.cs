//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Commerce.Tests.Services
{
    public class OrderServiceTests
    {
        private readonly IOrderService _orderService;
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<IHttpClientFactory> _httpClientFactory;
        private readonly Mock<ILogger<OrderService>> _logger;
        private readonly Mock<IUIContext> _uiContext;
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<IAppSettings> _appSettings;

        public OrderServiceTests()
        {

            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _httpClientFactory = new Mock<IHttpClientFactory>();
            _logger = new Mock<ILogger<OrderService>>();
            _appSettings = new Mock<IAppSettings>();
            _appSettings.Setup(s => s.GetSetting("Core.Order.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/core-order/v1");
            _uiContext = new Mock<IUIContext>();
            _mapper = new Mock<IMapper>();

            _orderService = new OrderService(_middleTierHttpClient.Object,
                _httpClientFactory.Object,
                _logger.Object,
                _appSettings.Object,
                _uiContext.Object,
                _mapper.Object);
        }

        [Fact]
        public async Task GetPdfInvoiceAsyncTestNull()
        {
            // Act
            var result = await _orderService.GetPdfInvoiceAsync(null);
            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetPdfInvoiceAsyncTest()
        {
            // Arrange
            string smallestPdf = "%PDF-1.trailer\n<</Root<</Pages<</Kids[<</MediaBox[0 0 3 3]>>]>>>>>>";
            var mockHttpMessageHandler = new Mock<HttpMessageHandler>();
            mockHttpMessageHandler.Protected()
                .Setup<Task<HttpResponseMessage>>("SendAsync", ItExpr.IsAny<HttpRequestMessage>(), ItExpr.IsAny<CancellationToken>())
                .ReturnsAsync(new HttpResponseMessage
                {
                    StatusCode = HttpStatusCode.OK,
                    Content = new StringContent(smallestPdf),
                });
            var client = new HttpClient(mockHttpMessageHandler.Object);
            _httpClientFactory.Setup(_ => _.CreateClient(It.IsAny<string>())).Returns(client);
            // Act
            var result = await _orderService.GetPdfInvoiceAsync("8101544574");
            // Assert
            Assert.NotNull(result);
            Assert.Equal(smallestPdf.Length, result.Length);
        }

        [Fact]
        public async Task GetInvoicesFromOrderIdAsyncTestNull()
        {
            // Act
            var result = await _orderService.GetInvoicesFromOrderIdAsync(null);
            // Assert
            Assert.Null(result);
        }
    }
}
