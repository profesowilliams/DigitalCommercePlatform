using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Actions.GetHeaderDetails;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Browse.Tests.Actions
{
    public class GetHeaderHandlerTests
    {
        private readonly Mock<IBrowseService> _mockBrowseService;
        private readonly Mock<IMapper> _mapper;

        public GetHeaderHandlerTests()
        {
            _mapper = new Mock<IMapper>();
            _mockBrowseService = new();
        }

        public string CatalogCriteria { get; private set; }
        public bool IsDefault { get; private set; }

        [Theory]
        [AutoDomainData]
        public async Task GetHeaderDetails(GetHeaderHandler.Response expected)
        {
            _mockBrowseService.Setup(x => x.GetHeader(
                       It.IsAny<GetHeaderHandler.Request>()
                       ))
                   .ReturnsAsync(expected);

            var handler = new GetHeaderHandler.Handler(_mockBrowseService.Object, _mapper.Object);

            var request = new GetHeaderHandler.Request(CatalogCriteria,IsDefault);

            var result = await handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().NotBeNull();
        }
    }
}

