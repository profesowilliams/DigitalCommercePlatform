//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.ActionItemsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.ConfigurationsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.CustomerAddress;
using DigitalCommercePlatform.UIServices.Account.Actions.DealsSummary;
using DigitalCommercePlatform.UIServices.Account.Actions.GetConfigurationsFor;
using DigitalCommercePlatform.UIServices.Account.Actions.GetMyQuotes;
using DigitalCommercePlatform.UIServices.Account.Actions.MyOrders;
using DigitalCommercePlatform.UIServices.Account.Actions.SavedCartsList;
using DigitalCommercePlatform.UIServices.Account.Actions.TopConfigurations;
using DigitalCommercePlatform.UIServices.Account.Actions.TopDeals;
using DigitalCommercePlatform.UIServices.Account.Actions.TopOrders;
using DigitalCommercePlatform.UIServices.Account.Actions.TopQuotes;
using DigitalCommercePlatform.UIServices.Account.Models;
using DigitalCommercePlatform.UIServices.Account.Models.Carts;
using DigitalCommercePlatform.UIServices.Account.Models.Configurations;
using DigitalCommercePlatform.UIServices.Account.Models.Deals;
using DigitalCommercePlatform.UIServices.Account.Models.Orders;
using DigitalCommercePlatform.UIServices.Account.Models.Quotes;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Features.Contexts.Models;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.ExceptionHandling;
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
            _appSettings.Setup(s => s.GetSetting("App.spa.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-spa/v1");
            _appSettings.Setup(s => s.GetSetting("App.Customer.Url")).Returns("https://eastus-dit-service.dc.tdebusiness.cloud/app-customer/v1");
            _uiContext = new Mock<IUIContext>();
            _mapper = new Mock<IMapper>();
            _renewalsService = new Mock<IRenewalsService>();
            _uiContext = new Mock<IUIContext>();
        }

        #region GetTopDeals Unit Tests

        [Fact]
        public async Task GetTopDeals_ValidRequest_ResponseNotNullAndValidType()
        {
            //Arrange
            var request = new GetTopDeals.Request();

            //Act
            var sut = GetService();
            var result = sut.GetTopDeals(request);

            //Assert
            Assert.NotNull(result);
            Assert.IsType<DealModel>(result);
        }

        #endregion GetTopDeals Unit Tests

        #region GetConfigurationsSummaryAsync Unit Tests

        [Fact]
        public async Task GetConfigurationsSummaryAsync_Test()
        {
            //Arrange
            GetConfigurationsSummary.Request request = new();
            request.Criteria = "123";
            //Act
            var sut = GetService();
            var result = sut.GetConfigurationsSummaryAsync(request);
            //Assert
            Assert.NotNull(result);
        }

        [Fact]
        public async Task GetConfigurationsSummaryAsync_ClientThrowsException_NotFoundProperlyCatched()
        {
            //Arrange
            GetConfigurationsSummary.Request request = new();

            _middleTierHttpClient.Setup(t => t.GetAsync<Response>(It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .Throws(new RemoteServerHttpException("", System.Net.HttpStatusCode.NotFound, new object()));

            //Act
            var sut = GetService();
            var result = await sut.GetConfigurationsSummaryAsync(request);

            //Assert
            result.Should().BeEquivalentTo(new ConfigurationsSummaryModel
            {
                Quoted = 0,
                UnQuoted = 0,
                OldConfigurations = 0,
                CurrencyCode = "USD"
            });
        }

        [Fact]
        public async Task GetConfigurationsSummaryAsync_ClientThrowsException_MethodThrowsAnother()
        {
            //Arrange
            GetConfigurationsSummary.Request request = new();

            var innerException = new RemoteServerHttpException();

            _middleTierHttpClient.Setup(t => t.GetAsync<Response>(It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .Throws(new RemoteServerHttpException("", System.Net.HttpStatusCode.BadRequest, new object(), innerException));

            var user = new User() { ID = "123" };
            _uiContext.Setup(t => t.User).Returns(user);

            //Act
            var sut = GetService();
            var act = () => sut.GetConfigurationsSummaryAsync(request);

            //Assert
            await Assert.ThrowsAsync<UIServiceException>(act);
        }

        #endregion GetConfigurationsSummaryAsync Unit Tests

        #region GetSavedCartListAsync Unit Tests

        [Fact]
        public async Task GetSavedCartListAsync_ValidRequest_RunsWithValidUrl()
        {
            //Arrange
            _middleTierHttpClient.Setup(t => t.GetAsync<List<SavedCartDetailsModel>>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new List<SavedCartDetailsModel>());

            var urlExpected = "listsavedcarts";

            //Act
            var sut = GetService();
            var result = await sut.GetSavedCartListAsync(new GetCartsList.Request(true, 1));

            //Assert
            _middleTierHttpClient.Verify(x => x.GetAsync<List<SavedCartDetailsModel>>(It.Is<string>(s => s.EndsWith(urlExpected)),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()), Times.Once());

            Assert.IsType<List<SavedCartDetailsModel>>(result);
        }

        [Fact]
        public async Task GetSavedCartListAsync_ValidRequest_ReturnsValidType()
        {
            //Arrange
            _middleTierHttpClient.Setup(t => t.GetAsync<List<SavedCartDetailsModel>>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new List<SavedCartDetailsModel>());

            //Act
            var sut = GetService();
            var result = await sut.GetSavedCartListAsync(new GetCartsList.Request(true, 1));

            //Assert
            Assert.IsType<List<SavedCartDetailsModel>>(result);
        }

        #endregion GetSavedCartListAsync Unit Tests

        #region GetConfigurationsFor Unit Tests

        [Fact]
        public async Task GetConfigurationsFor_ValidRequest_ResponseNotNullAndValidType()
        {
            //Arrange
            var request = new GetConfigurationsFor.Request(GetConfigurationsFor.RequestType.ConfigurationId);

            //Act
            var sut = GetService();
            var result = sut.GetConfigurationsFor(request);

            //Assert
            Assert.NotNull(result);
            Assert.IsType<GetConfigurationsForModel>(result);
        }

        [Fact]
        public async Task GetConfigurationsFor_ValidRequest_ResponseItemsCountIsValid()
        {
            //Arrange
            var request = new GetConfigurationsFor.Request(GetConfigurationsFor.RequestType.ConfigurationId);

            //Act
            var sut = GetService();
            var result = sut.GetConfigurationsFor(request);

            //Assert
            Assert.NotNull(result);
            result.Items.Count.Should().Be(20);
        }

        #endregion GetConfigurationsFor Unit Tests

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

        #region GetMyOrdersStatusAsync Unit Tests

        [Fact]
        public async Task GetMyOrdersStatusAsync_RunsClientWithValidUrl()
        {
            //Arrange
            var request = new GetMyOrdersStatus.Request()
            {
                FromDate = new DateTime(2020, 1, 1),
                ToDate = new DateTime(2020, 1, 1)
            };

            _middleTierHttpClient.Setup(t => t.GetAsync<OrderStatsDto>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new OrderStatsDto());

            var urlExpected = "tats?key=status&createdFrom=2020-01-01&createdTo=2020-01-01";

            //Act
            var sut = GetService();
            var result = await sut.GetMyOrdersStatusAsync(request);

            //Assert
            _middleTierHttpClient.Verify(x => x.GetAsync<OrderStatsDto>(
                It.Is<string>(s => s.EndsWith(urlExpected)),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()), Times.Once());
        }

        [Fact]
        public async Task GetMyOrdersStatusAsync_NoOrdersMatching_ReturnsEmptyResponseObject()
        {
            //Arrange
            var request = new GetMyOrdersStatus.Request()
            {
                FromDate = new DateTime(2020, 1, 1),
                ToDate = new DateTime(2020, 1, 1)
            };

            _middleTierHttpClient.Setup(t => t.GetAsync<OrderStatsDto>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new OrderStatsDto() { Data = null });

            //Act
            var sut = GetService();
            var result = await sut.GetMyOrdersStatusAsync(request);

            //Assert
            result.Should().BeEquivalentTo(new MyOrdersStatusDashboard());
        }

        [Fact]
        public async Task GetMyOrdersStatusAsync_NoOrdersInUSD_ReturnsEmptyResponseObject()
        {
            //Arrange
            var request = new GetMyOrdersStatus.Request()
            {
                FromDate = new DateTime(2020, 1, 1),
                ToDate = new DateTime(2020, 1, 1)
            };

            OrderStatsDataDto[] data = new OrderStatsDataDto[1];
            data[0] = new OrderStatsDataDto() { Currency = "PLN" };

            _middleTierHttpClient.Setup(t => t.GetAsync<OrderStatsDto>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new OrderStatsDto()
                {
                    Data = data
                });

            //Act
            var sut = GetService();
            var result = await sut.GetMyOrdersStatusAsync(request);

            //Assert
            result.Should().BeEquivalentTo(new MyOrdersStatusDashboard());
        }

        [Fact]
        public async Task GetMyOrdersStatusAsync_OrdersInUSD_ReturnsValidResponseObject()
        {
            //Arrange
            var request = new GetMyOrdersStatus.Request()
            {
                FromDate = new DateTime(2020, 1, 1),
                ToDate = new DateTime(2020, 1, 1)
            };

            OrderStatsDataDto[] data = new OrderStatsDataDto[2];
            data[0] = new OrderStatsDataDto() { Currency = "USD", Value = "IN_PROCESS", Count = "2" };
            data[1] = new OrderStatsDataDto() { Currency = "USD", Value = "ON_HOLD" };

            _middleTierHttpClient.Setup(t => t.GetAsync<OrderStatsDto>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new OrderStatsDto()
                {
                    Data = data
                });

            //Act
            var sut = GetService();
            var result = await sut.GetMyOrdersStatusAsync(request);

            //Assert
            result.Should().BeEquivalentTo(new MyOrdersStatusDashboard
            {
                InProcess = "2",
                OnHold = "0",
                Shipped = "0"
            });
        }

        #endregion GetMyOrdersStatusAsync Unit Tests

        #region GetMyOrdersSummaryAsync Unit Tests

        [Fact]
        public async Task GetMyOrdersSummaryAsync_IsMonthlyFalse_RunsClientWithValidUrl()
        {
            //Arrange
            var request = new GetMyOrders.Request()
            {
                IsMonthly = false
            };

            _middleTierHttpClient.Setup(t => t.GetAsync<OrderStatsDto>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new OrderStatsDto());

            var createdFrom = DateTime.Now.Date.AddDays(-90).ToString("yyyy-MM-dd");
            var createdTo = DateTime.Now.Date.AddHours(23).AddMinutes(59).AddSeconds(59).ToString("yyyy-MM-dd");
            var urlExpected = $"stats?key=status&createdFrom={createdFrom}&createdTo={createdTo}";

            //Act
            var sut = GetService();
            var result = await sut.GetMyOrdersSummaryAsync(request);

            //Assert
            _middleTierHttpClient.Verify(x => x.GetAsync<OrderStatsDto>(
                It.Is<string>(s => s.EndsWith(urlExpected)),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()), Times.Once());
        }

        [Fact]
        public async Task GetMyOrdersSummaryAsync_IsMonthlyTrue_RunsClientWithValidUrl()
        {
            //Arrange
            var request = new GetMyOrders.Request()
            {
                IsMonthly = true
            };

            _middleTierHttpClient.Setup(t => t.GetAsync<OrderStatsDto>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new OrderStatsDto());

            var createdFrom = DateTime.Now.Date.AddDays(-30).ToString("yyyy-MM-dd");
            var createdTo = DateTime.Now.Date.AddHours(23).AddMinutes(59).AddSeconds(59).ToString("yyyy-MM-dd");
            var urlExpected = $"stats?key=status&createdFrom={createdFrom}&createdTo={createdTo}";

            //Act
            var sut = GetService();
            var result = await sut.GetMyOrdersSummaryAsync(request);

            //Assert
            _middleTierHttpClient.Verify(x => x.GetAsync<OrderStatsDto>(
                It.Is<string>(s => s.EndsWith(urlExpected)),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()), Times.Once());
        }

        [Fact]
        public async Task GetMyOrdersSummaryAsync_ClientThrowsException_ExceptionCatchedDefaultReturned()
        {
            //Arrange
            var request = new GetMyOrders.Request()
            {
                IsMonthly = true
            };

            _middleTierHttpClient.Setup(t => t.GetAsync<OrderStatsDto>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .Throws(new RemoteServerHttpException("", System.Net.HttpStatusCode.NotFound, new object()));

            var createdFrom = DateTime.Now.Date.AddDays(-30).ToString("yyyy-MM-dd");
            var createdTo = DateTime.Now.Date.AddHours(23).AddMinutes(59).AddSeconds(59).ToString("yyyy-MM-dd");
            var urlExpected = $"stats?key=status&createdFrom={createdFrom}&createdTo={createdTo}";

            //Act
            var sut = GetService();
            var result = await sut.GetMyOrdersSummaryAsync(request);

            //Assert
            result.Should().BeEquivalentTo(new MyOrdersDashboard
            {
                CurrencyCode = "USD",
                CurrencySymbol = "$",
                IsMonthly = request.IsMonthly,
                Total = new OrderData { Amount = 0, FormattedAmount = string.Format("{0:N2}", 0), Percentage = "100%" },
                Processed = new OrderData { Amount = 0, FormattedAmount = string.Format("{0:N2}", 0), Percentage = string.Empty },
                Shipped = new OrderData { Amount = 0, FormattedAmount = string.Format("{0:N2}", 0), Percentage = string.Empty }
            });
        }

        [Fact]
        public async Task GetMyOrdersSummaryAsync_NoUsdOrders_EmptyObjectReturned()
        {
            //Arrange
            var request = new GetMyOrders.Request();

            var ordersData = new OrderStatsDataDto[2]
            {
                new OrderStatsDataDto() { Currency = "PLN" },
                new OrderStatsDataDto() { Currency = "EUR" }
            };

            _middleTierHttpClient.Setup(t => t.GetAsync<OrderStatsDto>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new OrderStatsDto()
                {
                    Data = ordersData
                });

            //Act
            var sut = GetService();
            var result = await sut.GetMyOrdersSummaryAsync(request);

            //Assert
            result.Should().BeEquivalentTo(new MyOrdersDashboard());
        }

        [Fact]
        public async Task GetMyOrdersSummaryAsync_ThrowsExceptionNoMatchingCode_DefaultReturned()
        {
            //Arrange
            var request = new GetMyOrders.Request();

            _middleTierHttpClient.Setup(t => t.GetAsync<OrderStatsDto>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .Throws(new RemoteServerHttpException("", System.Net.HttpStatusCode.BadRequest, new object()));

            //Act
            var sut = GetService();
            var result = await sut.GetMyOrdersSummaryAsync(request);

            //Assert
            result.Should().BeEquivalentTo(new MyOrdersDashboard());
        }

        [Fact]
        public async Task GetMyOrdersSummaryAsync_UsdOrders_ValidResponseObjectReturned()
        {
            //Arrange
            var request = new GetMyOrders.Request();

            var inProcess = 2;
            var onHold = 1;
            var shipped = 0;
            var open = 0;

            var ordersData = new OrderStatsDataDto[2]
            {
                new OrderStatsDataDto() { Currency = "USD", Value="IN_PROCESS", TotalValue = inProcess.ToString() },
                new OrderStatsDataDto() { Currency = "USD", Value = "ON_HOLD", TotalValue = onHold.ToString() }
            };

            _middleTierHttpClient.Setup(t => t.GetAsync<OrderStatsDto>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new OrderStatsDto()
                {
                    Data = ordersData
                });

            //Act
            var sut = GetService();
            var result = await sut.GetMyOrdersSummaryAsync(request);

            //Assert
            var total = inProcess + onHold + shipped + open;
            var percentageProcessed = (((inProcess + onHold) / total) * 100).ToString("F") + "%";
            var percentageShipped = ((shipped / total) * 100).ToString("F") + "%";

            result.Should().BeEquivalentTo(new MyOrdersDashboard
            {
                CurrencyCode = "USD",
                CurrencySymbol = "$",
                IsMonthly = request.IsMonthly,
                Total = new OrderData { Amount = 3, FormattedAmount = string.Format("{0:N2}", 3), Percentage = "100%" },
                Processed = new OrderData { Amount = 3, FormattedAmount = string.Format("{0:N2}", 3), Percentage = percentageProcessed },
                Shipped = new OrderData { Amount = 0, FormattedAmount = string.Format("{0:N2}", 0), Percentage = percentageShipped }
            });
        }

        #endregion GetMyOrdersSummaryAsync Unit Tests

        #region GetDealsSummaryAsync Unit Tests

        [Fact]
        public async Task GetDealsSummaryAsync_RunsClientWithValidUrl()
        {
            //Arrange
            var request = new GetDealsSummary.Request();

            _middleTierHttpClient.Setup(t => t.GetAsync<DigitalFoundation.Common.Features.Contexts.Models.FindResponse<DealsBase>>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new DigitalFoundation.Common.Features.Contexts.Models.FindResponse<DealsBase>());

            var validTo = DateTime.Now.AddYears(1).ToString("yyyy-MM-dd");
            var urlExpected = $"Find?ValidTo={validTo}&TotalCount=False&Details=False&WithPaginationInfo=False&SortBy=expirationDate";

            //Act
            var sut = GetService();
            var result = await sut.GetDealsSummaryAsync(request);

            //Assert
            _middleTierHttpClient.Verify(x => x.GetAsync<DigitalFoundation.Common.Features.Contexts.Models.FindResponse<DealsBase>>(
                It.Is<string>(s => s.EndsWith(urlExpected)),
                It.IsAny<List<object>>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()), Times.Once());
        }

        #endregion GetDealsSummaryAsync Unit Tests

        #region GetRenewalsExpirationDatesAsync Unit Tests

        [Fact]
        public async Task GetRenewalsExpirationDatesAsync_OneRenewalReturnedByService_ReturnsValidResponseList()
        {
            //Arrange
            var response = new RenewalDto[1] { new RenewalDto() { ExpirationDate = new DateTime(2020, 01, 02), StartDate = new DateTime(2020, 01, 01) } };

            _renewalsService.Setup(t => t.RenewalSearchAsync(It.IsAny<RenewalSearchDto>()))
                .ReturnsAsync(response);

            //Act
            var sut = GetService();
            var result = await sut.GetRenewalsExpirationDatesAsync("", "", 1);

            //Assert
            result.Should().BeEquivalentTo(new List<string>() { response[0].ExpirationDate.ToShortDateString() });
        }

        #endregion GetRenewalsExpirationDatesAsync Unit Tests

        #region GetTopConfigurationsAsync Unit Tests

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

        #endregion GetTopConfigurationsAsync Unit Tests

        #region MyQuotesSummaryAsync Unit Tests

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

        #endregion MyQuotesSummaryAsync Unit Tests

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