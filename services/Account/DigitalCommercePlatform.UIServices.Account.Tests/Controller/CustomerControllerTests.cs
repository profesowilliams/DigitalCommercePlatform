//2021 (c) Tech Data Corporation -. All Rights Reserved.

using DigitalCommercePlatform.UIServices.Account.Controllers;
using DigitalCommercePlatform.UIServices.Account.Models.Customers;
using DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerModel;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Controller
{
    public class CustomerControllerTests
    {
        private readonly Mock<IUIContext> _context;
        private readonly Mock<IMediator> _mediator;
        private readonly Mock<ICustomerService> _customerService;
        private readonly Mock<ILogger<CustomerController>> _logger;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<ISiteSettings> _siteSettings;

        public CustomerControllerTests()
        {
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("LocalizationList")).Returns("en-US");

            _customerService = new Mock<ICustomerService>();
            _mediator = new Mock<IMediator>();
            _logger = new Mock<ILogger<CustomerController>>();
            _siteSettings = new Mock<ISiteSettings>();
        }

        //[Fact]
        //public async Task RegisterCustomer_RequestNull_ReturnsBadRequest()
        //{
        //    //Arrange
        //    var controller = GetController();

        //    //Act
        //    var result = await controller.RegisterCustomerAsync(null);

        //    //Assert
        //    var response = result as ObjectResult;
        //    Assert.Equal((int)HttpStatusCode.BadRequest, response.StatusCode);
        //    Assert.Equal("Provided model is not valid", response.Value);
        //}

        //[Fact]
        //public async Task RegisterCustomer_RequestModelNotValid_ReturnsBadRequest()
        //{
        //    //Arrange
        //    var request = new RegisterCustomerRequestModel();
        //    var controller = GetController();

        //    //Act
        //    var result = await controller.RegisterCustomerAsync(request);

        //    //Assert
        //    var response = result as ObjectResult;
        //    Assert.Equal((int)HttpStatusCode.BadRequest, response.StatusCode);
        //    Assert.Equal("Provided model is not valid", response.Value);
        //}

        [Theory]
        [AutoDomainData]
        public async Task RegisterCustomer_RequestModelValid_ReturnsNoError(RegisterCustomerRequestModel request)
        {
            //Arrange
            _customerService.Setup(x => x.RegisterCustomerAsync(
                      It.IsAny<RegisterCustomerRequestModel>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(new RegisterCustomerResponseModel()
                  {
                      IsError = false
                  });

            //Act
            var controller = GetController();
            var result = await controller.RegisterCustomerAsync(request);

            //Assert
            var response = result as ObjectResult;
            Assert.Equal((int)HttpStatusCode.OK, response.StatusCode);
        }

        private object RegisterCustomerResponseModel()
        {
            throw new NotImplementedException();
        }

        [Theory]
        [AutoDomainData]
        public async Task RegisterCustomer_ErrorFromClient_ReturnsHttpError(RegisterCustomerRequestModel request)
        {
            //Arrange

            _customerService.Setup(x => x.RegisterCustomerAsync(
                      It.IsAny<RegisterCustomerRequestModel>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(new RegisterCustomerResponseModel()
                  {
                      IsError = true,
                      ErrorType = Enums.RegistrationErrorType.HttpError
                  });

            //Act
            var controller = GetController();
            var result = await controller.RegisterCustomerAsync(request);

            //Assert
            var response = result as ObjectResult;
            Assert.Equal((int)HttpStatusCode.BadRequest, response.StatusCode);
        }

        [Theory]
        [AutoDomainData]
        public async Task RegisterCustomer_ErrorFromClient_ReturnsInternalError(RegisterCustomerRequestModel request)
        {
            //Arrange

            _customerService.Setup(x => x.RegisterCustomerAsync(
                      It.IsAny<RegisterCustomerRequestModel>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(new RegisterCustomerResponseModel()
                  {
                      IsError = true,
                      ErrorType = Enums.RegistrationErrorType.InternalError
                  });

            //Act
            var controller = GetController();
            var result = await controller.RegisterCustomerAsync(request);

            //Assert
            var response = result as ObjectResult;
            Assert.Equal((int)HttpStatusCode.InternalServerError, response.StatusCode);
        }

        private CustomerController GetController()
        {
            return new CustomerController(_mediator.Object, _logger.Object, _customerService.Object);
        }
    }
}