//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.RegisterCustomer;
using DigitalCommercePlatform.UIServices.Account.Models.Customers;
using DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerModel;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Services
{
    public class CustomerServiceTests
    {
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<ILogger<CustomerService>> _logger;
        private readonly Mock<IUIContext> _uiContext;
        private readonly Mock<IAppSettings> _appSettings;
        private readonly Mock<IMapper> _mapper;

        public CustomerServiceTests()
        {
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _logger = new Mock<ILogger<CustomerService>>();
            _mapper = new Mock<IMapper>();
            _appSettings = new Mock<IAppSettings>();
            _appSettings.Setup(s => s.GetSetting("App.Customer.Url")).Returns("testUrl");
            _uiContext = new Mock<IUIContext>();
        }

        [Theory]
        [AutoDomainData]
        public async Task RegisterCustomerAsync_ValidRequest_RunsGetWithValidUrl(RegisterCustomerRequestModel model, CancellationToken cancellationToken)
        {
            //Arrange
            _middleTierHttpClient.Setup(t => t.PostAsync<RegisterCustomerResponseModel>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<object>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(new RegisterCustomerResponseModel()
                {
                    ErrorDescription = "test",
                    IsError = true,
                });

            var request = new RegisterCustomer.Request(model);

            var urlExpected = "/RegisterCustomer";

            //Act
            var sut = GetService();
            var result = await sut.RegisterCustomerAsync(request, cancellationToken);

            //Assert
            _middleTierHttpClient.Verify(x => x.PostAsync<RegisterCustomerResponseModel>(It.Is<string>(s => s.EndsWith(urlExpected)),
                It.IsAny<List<object>>(),
                It.IsAny<object>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()), Times.Once());
        }

        [Theory]
        [AutoDomainData]
        public async Task RegisterCustomerAsync_ClientThrowsError_ReturnsValidResponse(RegisterCustomerRequestModel model, CancellationToken cancellationToken)
        {
            //Arrange
            _middleTierHttpClient.Setup(t => t.PostAsync<RegisterCustomerResponseModel>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<object>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .Throws(new RemoteServerHttpException("", System.Net.HttpStatusCode.NotFound, new object()));

            var request = new RegisterCustomer.Request(model);

            //Act
            var sut = GetService();
            var result = await sut.RegisterCustomerAsync(request, cancellationToken);

            //Assert
            var expectedResponse = new ResponseBase<RegisterCustomer.Response>()
            {
                Error = new ErrorInformation()
                {
                    IsError = true,
                    Messages = new System.Collections.Generic.List<string>() { "Internal error occurred while processing your request" }
                }
            };

            result.Should().BeEquivalentTo(expectedResponse);
        }

        private CustomerService GetService()
        {
            return new CustomerService(new CustomerService.CustomerServiceArgs(_middleTierHttpClient.Object,
                _appSettings.Object,
                _logger.Object,
                _mapper.Object,
                _uiContext.Object
                ));
        }
    }
}