//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Models.Customers;
using DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerModel;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Security.Token;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Services
{
    [ExcludeFromCodeCoverage]
    public class CustomerServiceTests
    {
        private readonly Mock<ISimpleHttpClient> _simpleHttpClient;
        private readonly Mock<ILogger<CustomerService>> _logger;
        private readonly Mock<ITokenManagerService> _tokenManagerService;
        private readonly Mock<IAppSettings> _appSettings;
        private readonly Mock<IMapper> _mapper;

        public CustomerServiceTests()
        {
            _simpleHttpClient = new Mock<ISimpleHttpClient>();
            _tokenManagerService = new Mock<ITokenManagerService>();
            _logger = new Mock<ILogger<CustomerService>>();
            _mapper = new Mock<IMapper>();
            _appSettings = new Mock<IAppSettings>();
            _appSettings.Setup(s => s.GetSetting("App.Customer.Url")).Returns("testUrl");
        }

        [Theory]
        [AutoDomainData]
        public async Task RegisterCustomerAsync_ValidRequest_RunsGetWithValidUrl(RegisterCustomerRequestModel requestModel, CancellationToken cancellationToken)
        {
            //Arrange
            _simpleHttpClient.Setup(t => t.PostAsync<RegisterCustomerResponseModel>(
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

            var urlExpected = "/RegisterCustomer";

            //Act
            var sut = GetService();
            var result = await sut.RegisterCustomerAsync(requestModel, cancellationToken);

            //Assert
            _simpleHttpClient.Verify(x => x.PostAsync<RegisterCustomerResponseModel>(It.Is<string>(s => s.EndsWith(urlExpected)),
                It.IsAny<List<object>>(),
                It.IsAny<object>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()), Times.Once());
        }

        [Theory]
        [AutoDomainData]
        public async Task RegisterCustomerAsync_ClientThrowsError_ReturnsValidResponse(RegisterCustomerRequestModel request, CancellationToken cancellationToken)
        {
            //Arrange
            _simpleHttpClient.Setup(t => t.PostAsync<RegisterCustomerResponseModel>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<object>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .Throws(new RemoteServerHttpException("", System.Net.HttpStatusCode.NotFound, new object()));

            //Act
            var sut = GetService();
            var result = await sut.RegisterCustomerAsync(request, cancellationToken);

            //Assert
            var expectedResponse = new RegisterCustomerResponseModel()
            {
                IsError = true,
                ErrorDescription = "Http exception occurred.",
                ErrorType = Enums.RegistrationErrorType.HttpError
            };

            result.Should().BeEquivalentTo(expectedResponse);
        }

        [Theory]
        [AutoDomainData]
        public async Task RegisterCustomerAsync_ClientReturnsConflict_ReturnsValidResponse(RegisterCustomerRequestModel request, CancellationToken cancellationToken)
        {
            //Arrange
            _simpleHttpClient.Setup(t => t.PostAsync<RegisterCustomerResponseModel>(
                It.IsAny<string>(),
                It.IsAny<List<object>>(),
                It.IsAny<object>(),
                It.IsAny<Dictionary<string, object>>(),
                It.IsAny<Dictionary<string, string>>()))
                .Throws(new RemoteServerHttpException("", System.Net.HttpStatusCode.Conflict, new object()));

            //Act
            var sut = GetService();
            var result = await sut.RegisterCustomerAsync(request, cancellationToken);

            //Assert
            var expectedResponse = new RegisterCustomerResponseModel()
            {
                IsError = true,
                ErrorDescription = "Customer already exists.",
                ErrorType = Enums.RegistrationErrorType.AlreadyExists
            };

            result.Should().BeEquivalentTo(expectedResponse);
        }

        private CustomerService GetService()
        {
            return new CustomerService(new CustomerService.CustomerServiceArgs(_simpleHttpClient.Object, _tokenManagerService.Object,
                _appSettings.Object,
                _logger.Object,
                _mapper.Object
                ));
        }
    }
}