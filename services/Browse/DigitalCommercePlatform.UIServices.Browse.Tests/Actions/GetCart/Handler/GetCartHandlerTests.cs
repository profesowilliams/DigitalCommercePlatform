//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetCartDetails;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions
{
    public class GetCartHandlerTests
    {
        private readonly Mock<IMapper> _mapper;
        private readonly Mock<IBrowseService> _mockBrowseService;

        public GetCartHandlerTests()
        {
            _mapper = new Mock<IMapper>();
            _mockBrowseService = new();
        }

        public bool IsDefault { get; private set; }

        [Theory]
        [AutoDomainData]
        public async Task GetCartDetails(GetCartHandler.Response expected)
        {
           
            _mockBrowseService.Setup(x => x.GetCartDetails(
                       It.IsAny<GetCartHandler.Request>()
                       ))
                   .ReturnsAsync(expected);

            var handler = new GetCartHandler.Handler(_mockBrowseService.Object, _mapper.Object);

            var request = new GetCartHandler.Request(IsDefault);

            var result = await handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().NotBeNull();
        }
    }
}

