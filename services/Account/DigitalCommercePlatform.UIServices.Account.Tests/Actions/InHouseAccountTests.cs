//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Actions.InHouseAccount;
using DigitalCommercePlatform.UIServices.Account.Services;
using DigitalFoundation.Common.Features.Cache;
using DigitalFoundation.Common.TestUtilities;
using Moq;
using System.Threading;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Account.Tests.Actions
{
    public class InHouseAccountTests
    {
        private readonly Mock<ISessionIdBasedCacheProvider> _sessionIdBasedCacheProvider;
        private readonly Mock<ISecurityService> _securityService;
        private readonly Mock<IMapper> _mapper;

        public InHouseAccountTests()
        {
            _sessionIdBasedCacheProvider = new();
            _securityService = new();
            _mapper = new Mock<IMapper>();
        }

        [Theory]
        [AutoDomainData]
        public async Task GetInHouseTests(bool expected)
        {            
            _securityService.Setup(x => x.GetInHouseAccount()).Returns(expected);

            var handler = new GetInHouseAccount.Handler(_sessionIdBasedCacheProvider.Object, _mapper.Object, _securityService.Object);

            var request = new GetInHouseAccount.Request("AEM");

            var result = await handler.Handle(request, It.IsAny<CancellationToken>());

            Assert.NotNull(result);
        }
    }
}
