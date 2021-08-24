//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIService.Browse.Model.Customer;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCustomerDetails;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions
{
    public class GetCustomerHandlerTests
    {
        private readonly Mock<IBrowseService> _mockBrowseService;
        private readonly Mock<IMapper> _mockMapper;


        public GetCustomerHandlerTests()
        {
            _mockBrowseService = new();
            _mockMapper = new();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetCustomerDetails(IEnumerable<CustomerModel> expected)
        {
            _mockBrowseService.Setup(x => x.GetCustomerDetails())
                   .ReturnsAsync(expected);

            var handler = new GetCustomerHandler.Handler(_mockBrowseService.Object, _mockMapper.Object);

            var request = new GetCustomerHandler.Request();

            var result = await handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().NotBeNull();
        }
    }
}

