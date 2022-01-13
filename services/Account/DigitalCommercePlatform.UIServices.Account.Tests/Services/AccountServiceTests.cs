//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.ActionItemsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.CustomerAddress;
using DigitalCommercePlatform.UIServices.Account.Actions.GetMyQuotes;
using DigitalCommercePlatform.UIServices.Account.Actions.TopConfigurations;
using DigitalCommercePlatform.UIServices.Account.Actions.TopOrders;
using DigitalCommercePlatform.UIServices.Account.Actions.TopQuotes;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Models.Configurations;
using DigitalCommercePlatform.UIServices.Account.Models.Deals;
using DigitalCommercePlatform.UIServices.Account.Models.Orders;
using DigitalCommercePlatform.UIServices.Account.Models.Quotes;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using RenewalsService;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Services
{
    public class AccountServiceTests
    {
        private readonly Mock<IUIContext> _uiContext;
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<ILogger<AccountService>> _logger;
        private readonly Mock<IRenewalsService> _renewalsService;
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<IAppSettings> _appSettings;

        public AccountServiceTests()
        {
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _logger = new Mock<ILogger<AccountService>>();
            _appSettings = new Mock<IAppSettings>();
            _appSettings.Setup(s => s.GetSetting("App.Configuration.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-configuration/v1");
            _appSettings.Setup(s => s.GetSetting("App.Order.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-order/v1");
            _appSettings.Setup(s => s.GetSetting("App.Quote.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-quote/v1");
            _appSettings.Setup(s => s.GetSetting("App.Cart.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-cart/v1");
            _appSettings.Setup(s => s.GetSetting("App.Price.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-price/v1");
            _appSettings.Setup(s => s.GetSetting("App.Customer.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-customer/v1");
            _uiContext = new Mock<IUIContext>();
            _mapper = new Mock<IMapper>();
            _renewalsService = new Mock<IRenewalsService>();
            _uiContext = new Mock<IUIContext>();
        }

        [Fact]
        public async Task GetConfigurationsSummaryAsync_Test()
        {
            //arrange
            GetConfigurationsSummary.Request request = new();
            request.Criteria = "123";
            //Act
            var sut = GetService();
            var result = sut.GetConfigurationsSummaryAsync(request);
            //Assert
            Assert.NotNull(result);
        }

        #region GetAddress Unit Tests

        [Fact]
        public async Task GetAddress_ResponseReturnNoAddresses_SimpleReturn()
        {
            //Arrange
            _uiContext.SetupGet(t => t.User).Returns(new DigitalFoundation.Common.Features.Contexts.Models.User()
            {
                ActiveCustomer = new DigitalFoundation.Common.Features.Contexts.Models.Customer()
                {
                    CustomerNumber = "123"
                }
            });

            var request = new GetAddress.Request()
            {
                IgnoreSalesOrganization = true,
                Criteria = "123",
            };

            _middleTierHttpClient.Setup(t => t.GetAsync<IEnumerable<AddressDetails>>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
            .ReturnsAsync(new List<AddressDetails>());

            //Act
            var sut = GetService();
            var result = await sut.GetAddress(request);

            //Assert
            result.Should().BeEquivalentTo(new List<AddressDetails>());
        }

        [Fact]
        public async Task GetAddress_ResponseReturnNotEmptyListWithNoDetails_SimpleReturn()
        {
            //Arrange
            _uiContext.SetupGet(t => t.User).Returns(new DigitalFoundation.Common.Features.Contexts.Models.User()
            {
                ActiveCustomer = new DigitalFoundation.Common.Features.Contexts.Models.Customer()
                {
                    CustomerNumber = "123"
                }
            });

            var request = new GetAddress.Request()
            {
                IgnoreSalesOrganization = true,
                Criteria = "123",
            };

            _middleTierHttpClient.Setup(t => t.GetAsync<IEnumerable<AddressDetails>>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
            .ReturnsAsync(new List<AddressDetails>()
            {
                new AddressDetails()
                {
                    addresses = new()
                }
            });

            //Act
            var sut = GetService();
            var result = await sut.GetAddress(request);

            //Assert
            result.Should().BeEquivalentTo(new List<AddressDetails>()
            {
                new AddressDetails()
                {
                    addresses = new()
                }
            });
        }

        [Fact]
        public async Task GetAddress_IgnoreSalesOrgFalse_FiltersSalesOrgFromAddresses()
        {
            //Arrange
            _uiContext.SetupGet(t => t.User).Returns(new DigitalFoundation.Common.Features.Contexts.Models.User()
            {
                ActiveCustomer = new DigitalFoundation.Common.Features.Contexts.Models.Customer()
                {
                    CustomerNumber = "123",
                    System = "2"
                }
            });

            var request = new GetAddress.Request()
            {
                IgnoreSalesOrganization = false,
                Criteria = "ALL",
            };

            _middleTierHttpClient.Setup(t => t.GetAsync<IEnumerable<AddressDetails>>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
            .ReturnsAsync(new List<AddressDetails>()
            {
                new AddressDetails()
                {
                    addresses = new()
                    {
                        new() { City="test", SalesOrganization = "1111"},
                        new() { City="anotherTest", SalesOrganization = "0100"},
                    },
                }
            });

            //Act
            var sut = GetService();
            var result = await sut.GetAddress(request);

            //Assert
            result.Should().BeEquivalentTo(new List<AddressDetails>()
            {
                new AddressDetails()
                {
                    addresses = new()
                    {
                        new() { City="anotherTest", SalesOrganization = "0100"}
                    },
                }
            });
        }

        [Fact]
        public async Task GetAddress_IgnoreSalesOrgFalse_NoSalesOrgToFilterOutFromAddresses()
        {
            //Arrange
            _uiContext.SetupGet(t => t.User).Returns(new DigitalFoundation.Common.Features.Contexts.Models.User()
            {
                ActiveCustomer = new DigitalFoundation.Common.Features.Contexts.Models.Customer()
                {
                    CustomerNumber = "123",
                    System = "2"
                }
            });

            var request = new GetAddress.Request()
            {
                IgnoreSalesOrganization = false,
                Criteria = "ALL",
            };

            _middleTierHttpClient.Setup(t => t.GetAsync<IEnumerable<AddressDetails>>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
            .ReturnsAsync(new List<AddressDetails>()
            {
                new AddressDetails()
                {
                    addresses = new()
                    {
                        new() { City="test", SalesOrganization = "0100"},
                        new() { City="anotherTest", SalesOrganization = "0100"},
                    },
                }
            });

            //Act
            var sut = GetService();
            var result = await sut.GetAddress(request);

            //Assert
            result.Should().BeEquivalentTo(new List<AddressDetails>()
            {
                new AddressDetails()
                {
                    addresses = new()
                    {
                        new() { City="test", SalesOrganization = "0100"},
                        new() { City="anotherTest", SalesOrganization = "0100"},
                    },
                }
            });
        }

        [Fact]
        public async Task GetAddress_IgnoreSalesOrgFalse_AllSalesOrgFilteredOutFromAddresses()
        {
            //Arrange
            _uiContext.SetupGet(t => t.User).Returns(new DigitalFoundation.Common.Features.Contexts.Models.User()
            {
                ActiveCustomer = new DigitalFoundation.Common.Features.Contexts.Models.Customer()
                {
                    CustomerNumber = "123",
                    System = "1"
                }
            });

            var request = new GetAddress.Request()
            {
                IgnoreSalesOrganization = false,
                Criteria = "ALL",
            };

            _middleTierHttpClient.Setup(t => t.GetAsync<IEnumerable<AddressDetails>>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
            .ReturnsAsync(new List<AddressDetails>()
            {
                new AddressDetails()
                {
                    addresses = new()
                    {
                        new() { City="test", SalesOrganization = "0100"},
                        new() { City="anotherTest", SalesOrganization = "0100"},
                    },
                }
            });

            //Act
            var sut = GetService();
            var result = await sut.GetAddress(request);

            //Assert
            result.Should().BeEquivalentTo(new List<AddressDetails>()
            {
                new AddressDetails()
                {
                    addresses = new()
                }
            });
        }

        [Fact]
        public async Task GetAddress_SalesOrgEmptyNoIgnore_NoSalesOrgFilteredOutFromAddressesCriteriaNotAll()
        {
            //Arrange
            _uiContext.SetupGet(t => t.User).Returns(new DigitalFoundation.Common.Features.Contexts.Models.User()
            {
                ActiveCustomer = new DigitalFoundation.Common.Features.Contexts.Models.Customer()
                {
                    CustomerNumber = "123",
                    System = "1"
                }
            });

            var request = new GetAddress.Request()
            {
                IgnoreSalesOrganization = false,
                Criteria = "TEST",
            };

            _middleTierHttpClient.Setup(t => t.GetAsync<IEnumerable<AddressDetails>>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
            .ReturnsAsync(new List<AddressDetails>()
            {
                new AddressDetails()
                {
                    addresses = new()
                    {
                        new() { City="test", SalesOrganization = "", AddressType="test"},
                        new() { City="anotherTest", SalesOrganization = "", AddressType="notMatchingTest"},
                    },
                }
            });

            //Act
            var sut = GetService();
            var result = await sut.GetAddress(request);

            //Assert
            result.Should().BeEquivalentTo(new List<AddressDetails>()
            {
                new AddressDetails()
                {
                    addresses = new()
                    {
                        new() { City="test", SalesOrganization = "", AddressType="test"}
                    }
                }
            });
        }

        [Fact]
        public async Task GetAddress_IgnoreSalesOrgFalse_NoSalesOrgFilteredOutFromAddressesCriteriaNotAll()
        {
            //Arrange
            _uiContext.SetupGet(t => t.User).Returns(new DigitalFoundation.Common.Features.Contexts.Models.User()
            {
                ActiveCustomer = new DigitalFoundation.Common.Features.Contexts.Models.Customer()
                {
                    CustomerNumber = "123",
                    System = "2"
                }
            });

            var request = new GetAddress.Request()
            {
                IgnoreSalesOrganization = false,
                Criteria = "TEST",
            };

            _middleTierHttpClient.Setup(t => t.GetAsync<IEnumerable<AddressDetails>>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
            .ReturnsAsync(new List<AddressDetails>()
            {
                new AddressDetails()
                {
                    addresses = new()
                    {
                        new() { City="test", SalesOrganization = "0100", AddressType="test"},
                        new() { City="anotherTest", SalesOrganization = "0100", AddressType="notMatchingTest"},
                    },
                }
            });

            //Act
            var sut = GetService();
            var result = await sut.GetAddress(request);

            //Assert
            result.Should().BeEquivalentTo(new List<AddressDetails>()
            {
                new AddressDetails()
                {
                    addresses = new()
                    {
                        new() { City="test", SalesOrganization = "0100", AddressType="test"}
                    }
                }
            });
        }

        [Fact]
        public async Task GetAddress_IgnoreSalesOrgTrue_NoSalesOrgFilteredOutFromAddressesCriteriaNotAll()
        {
            //Arrange
            _uiContext.SetupGet(t => t.User).Returns(new DigitalFoundation.Common.Features.Contexts.Models.User()
            {
                ActiveCustomer = new DigitalFoundation.Common.Features.Contexts.Models.Customer()
                {
                    CustomerNumber = "123",
                    System = "2"
                }
            });

            var request = new GetAddress.Request()
            {
                IgnoreSalesOrganization = true,
                Criteria = "TEST",
            };

            _middleTierHttpClient.Setup(t => t.GetAsync<IEnumerable<AddressDetails>>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
            .ReturnsAsync(new List<AddressDetails>()
            {
                new AddressDetails()
                {
                    addresses = new()
                    {
                        new() { City="test", SalesOrganization = "0100", AddressType="test"},
                        new() { City="test", SalesOrganization = "1111", AddressType="test"},
                        new() { City="anotherTest", SalesOrganization = "0100", AddressType="notMatchingTest"}
                    },
                }
            });

            //Act
            var sut = GetService();
            var result = await sut.GetAddress(request);

            //Assert
            result.Should().BeEquivalentTo(new List<AddressDetails>()
            {
                new AddressDetails()
                {
                    addresses = new()
                    {
                        new() { City="test", SalesOrganization = "0100", AddressType="test"},
                        new() { City="test", SalesOrganization = "1111", AddressType="test"}
                    }
                }
            });
        }

        [Fact]
        public async Task GetAddress_NoActiveCustomer_SalesOrgEmptyString()
        {
            //Arrange
            _uiContext.SetupGet(t => t.User).Returns(new DigitalFoundation.Common.Features.Contexts.Models.User()
            {
                ActiveCustomer = null
            });

            var request = new GetAddress.Request()
            {
                IgnoreSalesOrganization = false,
                Criteria = "TEST",
            };

            _middleTierHttpClient.Setup(t => t.GetAsync<IEnumerable<AddressDetails>>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
            .ReturnsAsync(new List<AddressDetails>()
            {
                new AddressDetails()
                {
                    addresses = new()
                    {
                        new() { City="test", SalesOrganization = "0100", AddressType="test"},
                        new() { City="test", SalesOrganization = "1111", AddressType="test"},
                        new() { City="anotherTest", SalesOrganization = "0100", AddressType="notMatchingTest"}
                    },
                }
            });

            //Act
            var sut = GetService();
            var result = await sut.GetAddress(request);

            //Assert
            result.Should().BeEquivalentTo(new List<AddressDetails>()
            {
                new AddressDetails()
                {
                    addresses = new()
                }
            });
        }

        #endregion GetAddress Unit Tests

        #region GetTopOrdersAsync Unit Tests

        [Fact]
        public async Task GetTopOrdersAsync_RequestToSortDescTop1_RunsGetWithValidUrl()
        {
            //Arrange
            _middleTierHttpClient.Setup(t => t.GetAsync<OrdersContainer>(It.IsAny<string>(), It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>())).ReturnsAsync(new OrdersContainer()
                {
                    Data = new List<OrderModel>()
                });

            var request = new GetTopOrders.Request()
            {
                Sortby = null,
                SortDirection = "desc",
                Top = 1
            };
            var urlExpected = "Find?&SortBy=Price&SortAscending=False&pageSize=1&WithPaginationInfo=false";

            //Act
            var sut = GetService();
            var result = await sut.GetTopOrdersAsync(request);

            //Assert
            _middleTierHttpClient.Verify(x => x.GetAsync<OrdersContainer>(It.Is<string>(s => s.EndsWith(urlExpected)),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()), Times.Once());
        }

        [Fact]
        public async Task GetTopOrdersAsync__RequestToSortAscByDate_RunsGetWithValidUrl()
        {
            //Arrange
            _middleTierHttpClient.Setup(t => t.GetAsync<OrdersContainer>(It.IsAny<string>(), It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>())).ReturnsAsync(new OrdersContainer()
                {
                    Data = new List<OrderModel>()
                });

            var request = new GetTopOrders.Request()
            {
                Sortby = "Date",
                SortDirection = "asc",
                Top = 1
            };
            var urlExpected = "Find?&SortBy=Date&SortAscending=True&pageSize=1&WithPaginationInfo=false";

            //Act
            var sut = GetService();
            var result = await sut.GetTopOrdersAsync(request);

            //Assert
            _middleTierHttpClient.Verify(x => x.GetAsync<OrdersContainer>(It.Is<string>(s => s.EndsWith(urlExpected)),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()), Times.Once());
        }

        #endregion GetTopOrdersAsync Unit Tests

        #region GetTopQuotesAsync Unit Tests

        [Fact]
        public async Task GetTopQuotesAsync__RequestToSortAscByDate_RunsGetWithValidUrl()
        {
            //Arrange
            _middleTierHttpClient.Setup(t => t.GetAsync<Models.Quotes.FindResponse<IEnumerable<QuoteModel>>>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new Models.Quotes.FindResponse<IEnumerable<QuoteModel>>());

            var request = new GetTopQuotes.Request()
            {
                Sortby = "Date",
                SortDirection = "asc",
                Top = 1
            };
            var urlExpected = "find?&SortBy=Date&SortAscending=True&pageSize=1";

            //Act
            var sut = GetService();
            var result = await sut.GetTopQuotesAsync(request);

            //Assert
            _middleTierHttpClient.Verify(x => x.GetAsync<Models.Quotes.FindResponse<IEnumerable<QuoteModel>>>(It.Is<string>(s => s.EndsWith(urlExpected)),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()), Times.Once());
        }

        [Fact]
        public async Task GetTopQuotesAsync__RequestToSortDescByPrice_RunsGetWithValidUrl()
        {
            //Arrange
            _middleTierHttpClient.Setup(t => t.GetAsync<Models.Quotes.FindResponse<IEnumerable<QuoteModel>>>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new Models.Quotes.FindResponse<IEnumerable<QuoteModel>>());

            var request = new GetTopQuotes.Request()
            {
                Sortby = "",
                SortDirection = "desc",
                Top = 1
            };
            var urlExpected = "find?&SortBy=Price&SortAscending=False&pageSize=1";

            //Act
            var sut = GetService();
            var result = await sut.GetTopQuotesAsync(request);

            //Assert
            _middleTierHttpClient.Verify(x => x.GetAsync<Models.Quotes.FindResponse<IEnumerable<QuoteModel>>>(It.Is<string>(s => s.EndsWith(urlExpected)),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()), Times.Once());
        }

        #endregion GetTopQuotesAsync Unit Tests

        #region GetActionItemsSummaryAsync Unit Tests

        [Fact]
        public async Task GetActionItemsSummaryAsync_RunsWithValidUrlsOnceEachMethod()
        {
            //Arrange
            var request = new GetActionItems.Request();

            _middleTierHttpClient.Setup(t => t.GetAsync<OrderNumberDto>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new OrderNumberDto() { Count = 1 });

            _middleTierHttpClient.Setup(t => t.GetAsync<DealsExpiringDto>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new DealsExpiringDto() { Count = 1 });

            var urlExpectedOrders = "Find?Status=ON_HOLD&WithPaginationInfo=True";
            var urlExpectedDeals = $"Find?ValidTo={DateTime.Now.AddDays(1).ToString("yyyy-MM-dd")}&TotalCount=True&Details=False";

            //Act
            var sut = GetService();
            var result = await sut.GetActionItemsSummaryAsync(request);

            //Assert
            _middleTierHttpClient.Verify(x => x.GetAsync<OrderNumberDto>(It.Is<string>(s => s.EndsWith(urlExpectedOrders)),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()), Times.Once());

            _middleTierHttpClient.Verify(x => x.GetAsync<DealsExpiringDto>(It.Is<string>(s => s.EndsWith(urlExpectedDeals)),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()), Times.Once());
        }

        [Fact]
        public async Task GetActionItemsSummaryAsync_GetBlockedOrdersClientThrowsException_BlockedOrdersEqualsZero()
        {
            //Arrange
            var request = new GetActionItems.Request();

            _middleTierHttpClient.Setup(t => t.GetAsync<OrderNumberDto>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .Throws(new RemoteServerHttpException("", System.Net.HttpStatusCode.NotFound, new object()));

            _middleTierHttpClient.Setup(t => t.GetAsync<DealsExpiringDto>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new DealsExpiringDto() { Count = 1 });

            //Act
            var sut = GetService();
            var result = await sut.GetActionItemsSummaryAsync(request);

            //Assert
            result.OrdersBlocked.Should().Be(0);
        }

        #endregion GetActionItemsSummaryAsync Unit Tests

        [Fact]
        public async Task GetTopConfigurationsAsync_RunsWithValidUrlOnce()
        {
            //Arrange
            var request = new GetTopConfigurations.Request()
            {
                SortBy = "",
                SortDirection = "asc",
                Top = 1
            };

            _middleTierHttpClient.Setup(t => t.GetAsync<TopConfigurationDto>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new TopConfigurationDto());

            var urlExpected = "find?Details=False&SortBy=TotalListPrice&SortByAscending=True&Page=1&PageSize=1";

            //Act
            var sut = GetService();
            var result = await sut.GetTopConfigurationsAsync(request);

            //Assert
            _middleTierHttpClient.Verify(x => x.GetAsync<TopConfigurationDto>(
                It.Is<string>(s => s.EndsWith(urlExpected)),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()), Times.Once());
        }

        [Fact]
        public async Task MyQuotesSummaryAsync_RunsWithValidUrl()
        {
            //Arrange
            var request = new MyQuoteDashboard.Request();

            _middleTierHttpClient.Setup(t => t.GetAsync<QuoteStatistics>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new QuoteStatistics());

            var urlExpected = "/GetQuoteStatistics";

            //Act
            var sut = GetService();
            var result = await sut.MyQuotesSummaryAsync(request);

            //Assert
            _middleTierHttpClient.Verify(x => x.GetAsync<QuoteStatistics>(
                It.Is<string>(s => s.EndsWith(urlExpected)),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()), Times.Once());
        }

        private AccountService GetService()
        {
            return new AccountService(new(_middleTierHttpClient.Object,
                _appSettings.Object,
                _logger.Object,
                _mapper.Object,
                _renewalsService.Object,
                _uiContext.Object
                ));
        }
    }
}