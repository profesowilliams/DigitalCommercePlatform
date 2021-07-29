using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.VendorAuthorizedURL;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Actions
{
    public class GetVendorAuthorizeURLTests
    {
        private readonly Mock<IVendorService> _mockVendorService;
        private readonly Mock<IMapper> _mapper;

        public GetVendorAuthorizeURLTests()
        {
            _mockVendorService = new();
            _mapper = new Mock<IMapper>();
        }

        public string vendor { get; private set; }

        [Theory]
        [AutoDomainData]
        public async Task GetCatalogDetails(string expected)
        {
            _mockVendorService.Setup(x => x.VendorAutorizationURL(
                      It.IsAny<getVendorAuthorizeURL.Request>()
                      ))
                  .ReturnsAsync(expected);

            var handler = new getVendorAuthorizeURL.Handler(_mockVendorService.Object, _mapper.Object);


            var request = new getVendorAuthorizeURL.Request(vendor);

            var result = await handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().NotBeNull();
        }
    }
}
