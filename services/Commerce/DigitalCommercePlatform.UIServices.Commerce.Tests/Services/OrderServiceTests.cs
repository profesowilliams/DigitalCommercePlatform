//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using System;
using System.Collections.Generic;
using System.Linq;
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
        private readonly Mock<IHelperService> _helperService;
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
            _helperService = new Mock<IHelperService>();

            _orderService = new OrderService(_middleTierHttpClient.Object,
                _httpClientFactory.Object,
                _logger.Object,
                _appSettings.Object,
                _uiContext.Object,
                _mapper.Object,
                _helperService.Object
                );
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

        [Fact]
        public async Task GetOrderByIdAsync_Test()
        {
            // Act
            var result = await _orderService.GetOrderByIdAsync("708546");
            // Assert
            Assert.Null(result);
        }

        [Fact]
        public void PopulateOrderDetails_Test()
        {
            //arrange
            var objSource = new Models.Order.Internal.Source { ID = "708546" };


            Item testLine = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                Tax = (decimal?)12.08,
                Freight = (decimal?)12.08,
                TotalPrice = (decimal?)12.08,
            };

            List<Item> lstItems = new List<Item>();
            lstItems.Add(testLine);

            Models.Order.Internal.OrderModel request = new Models.Order.Internal.OrderModel
            {
                Source = objSource,
                Items = lstItems
            };

            Type type;
            object objType;
            InitiateOrderService(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "PopulateOrderDetails" && x.IsPrivate);

            //Act
            var result = imageProductModel.Invoke(objType, new object[] { request });
            Assert.NotNull(result);
        }

        [Fact]
        public void FindOrder_Test()
        {
            SearchCriteria orderParameters = new()
            {
                Origin = "web",
                PageNumber = 1,
                PageSize = 25,
                SortAscending = true,
                SortBy = "Created",
                WithPaginationInfo = true
            };

            Type type;
            object objType;
            InitiateOrderService(out type, out objType);

            var findOrderQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "FindOrder" && x.IsPrivate);

            var result = findOrderQuery.Invoke(objType, new object[] { orderParameters });
            Assert.NotNull(result);
        }

        [Fact]
        public void CalculateFreight_Test()
        {
            //arrange
            var objSource = new Models.Order.Internal.Source { ID = "708546" };


            Item testLine = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                Tax = (decimal?)12.08,
                Freight = (decimal?)12.08,
                TotalPrice = (decimal?)12.08,
            };

            List<Item> lstItems = new List<Item>();
            lstItems.Add(testLine);

            Models.Order.Internal.OrderModel request = new Models.Order.Internal.OrderModel
            {
                Source = objSource,
                Items = lstItems
            };

            Type type;
            object objType;
            InitiateOrderService(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "CalculateFreight" && x.IsPrivate);

            //Act
            var result = imageProductModel.Invoke(objType, new object[] { request });
            Assert.NotNull(result);
        }

        [Fact]
        public void CalculateOtherFees_Test()
        {
            //arrange
            var objSource = new Models.Order.Internal.Source { ID = "708546" };


            Item testLine = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                Tax = (decimal?)12.08,
                Freight = (decimal?)12.08,
                TotalPrice = (decimal?)12.08,
                OtherFees = (decimal?)122.08
            };

            List<Item> lstItems = new List<Item>();
            lstItems.Add(testLine);

            Models.Order.Internal.OrderModel request = new Models.Order.Internal.OrderModel
            {
                Source = objSource,
                Items = lstItems
            };

            Type type;
            object objType;
            InitiateOrderService(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "CalculateFreight" && x.IsPrivate);

            //Act
            var result = imageProductModel.Invoke(objType, new object[] { request });
            Assert.NotNull(result);
        }

        [Fact]
        public void CalculateTax_Test()
        {
            //arrange
            var objSource = new Models.Order.Internal.Source { ID = "708546" };


            Item testLine = new()
            {
                Quantity = 1,
                UnitPrice = (decimal?)12.08,
                Tax = (decimal?)12.08,
                Freight = (decimal?)12.08,
                TotalPrice = (decimal?)12.08,
                OtherFees = (decimal?)122.08
            };

            List<Item> lstItems = new List<Item>();
            lstItems.Add(testLine);

            Models.Order.Internal.OrderModel request = new Models.Order.Internal.OrderModel
            {
                Source = objSource,
                Items = lstItems
            };

            Type type;
            object objType;
            InitiateOrderService(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "CalculateTax" && x.IsPrivate);

            //Act
            var result = imageProductModel.Invoke(objType, new object[] { request });
            Assert.NotNull(result);
        }

        [Fact]
        public void OrderReturnsInformationForInvoice_Test()
        {
            OrderModel item = new()
            {
                Return = false
            };
            
            List<string> invoices = new List<string> { "8033586697", "8033621249", "8033340557" };
            Type type;
            object objType;
            InitiateOrderService(out type, out objType);

            var imageProductModel = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "OrderReturnsInformationForInvoice" && x.IsPrivate);

            //Act
            var result = imageProductModel.Invoke(objType, new object[] { item, invoices });
            Assert.NotNull(result);
        }

        [Fact]
        public void CancelledOrderPayment_Test()
        {
            Source source = new()
            {
                ID = "1234",
                SalesOrg = "0100",
                System = "Renewal"
            };
            List<Item> lstItems = new List<Item>();
            Item item = new()
            {
                Tax = 1.6M,
                Freight = 3.7M,
                OtherFees = 1.3M,
            };
            lstItems.Add(item);
            OrderModel orderModel = new()
            {
                Source = source,
                Return = false,
                Status = Status.SHIPPED,
                Tax = 1.6M,
                Price = 7.2M,
                Freight = 3.7M,
                OtherFees = 1.3M,
                SubTotal = 7.9M,
                Items = lstItems
            };

            //Act
            Type type;
            object objType;
            InitiateOrderService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "CancelledOrderPayment" && x.IsPrivate);

            apiQuery.Invoke(objType, new object[] { orderModel });

            // Assert
            Assert.NotNull(orderModel.Total);
        }


        [Fact]
        public void OrderPayment_Test()
        {
            Source source = new()
            {
                ID = "1234",
                SalesOrg = "0100",
                System = "Renewal"
            };
            List<Item> lstItems = new List<Item>();
            Item item = new()
            {
                Tax = 1.6M,
                Freight = 3.7M,
                OtherFees = 1.3M,
            };
            lstItems.Add(item);
            OrderModel orderModel = new()
            {
                Source = source,
                Return = false,
                Status = Status.SHIPPED,
                Tax = 1.6M,
                Freight = 3.7M,
                OtherFees = 1.3M,
                Price = 7.2M,
                SubTotal = 7.9M,
                Items= lstItems
            };

            //Act
            Type type;
            object objType;
            InitiateOrderService(out type, out objType);

            var apiQuery = type.GetMethods(System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                .First(x => x.Name == "CancelledOrderPayment" && x.IsPrivate);

            apiQuery.Invoke(objType, new object[] { orderModel });

            // Assert
            Assert.NotNull(orderModel.Total);
        }
        private void InitiateOrderService(out Type type, out object objType)
        {
            type = typeof(OrderService);
            objType = Activator.CreateInstance(type,
                _middleTierHttpClient.Object,
                _httpClientFactory.Object,
                _logger.Object,
                _appSettings.Object,
                _uiContext.Object,
                _mapper.Object,
                _helperService.Object
                );
        }
    }
}
