//2021 (c) Tech Data Corporation -. All Rights Reserved.

using DigitalCommercePlatform.UIServices.Account.Actions.RegisterCustomer;
using DigitalCommercePlatform.UIServices.Account.Controllers;
using DigitalCommercePlatform.UIServices.Account.Models.Customers;
using DigitalCommercePlatform.UIServices.Account.Models.Customers.RegisterCustomerModel;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
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
        private readonly Mock<ILogger<CustomerController>> _logger;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly Mock<ISiteSettings> _siteSettings;

        public CustomerControllerTests()
        {
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("LocalizationList")).Returns("en-US");

            _context = new Mock<IUIContext>();
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
            _mediator.Setup(x => x.Send(
                      It.IsAny<RegisterCustomer.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(new ResponseBase<RegisterCustomer.Response>() { Content = new RegisterCustomer.Response() });

            //Act
            var controller = GetController();
            var result = await controller.RegisterCustomerAsync(request);

            //Assert
            var response = result as ObjectResult;
            Assert.Equal((int)HttpStatusCode.OK, response.StatusCode);
        }

        [Theory]
        [AutoDomainData]
        public async Task RegisterCustomer_ErrorFromClient_ReturnsValidError(RegisterCustomerRequestModel request)
        {
            //Arrange

            _mediator.Setup(x => x.Send(
                      It.IsAny<RegisterCustomer.Request>(),
                      It.IsAny<CancellationToken>()))
                  .ReturnsAsync(new ResponseBase<RegisterCustomer.Response>()
                  {
                      Content = new RegisterCustomer.Response(),
                      Error = new ErrorInformation() { IsError = true, Code = 500 }
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
            return new CustomerController(_mediator.Object, _appSettingsMock.Object, _logger.Object, _context.Object, _siteSettings.Object);
        }
    }
}