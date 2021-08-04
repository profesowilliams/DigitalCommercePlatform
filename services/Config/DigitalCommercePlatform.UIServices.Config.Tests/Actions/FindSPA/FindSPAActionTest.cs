using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.TestUtilities;
using Moq;
using DigitalCommercePlatform.UIServices.Config.Actions.FindSPA;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;
using DigitalCommercePlatform.UIServices.Config.Models.SPA;
using System.Threading;
using DigitalFoundation.Common.Models;
using FluentAssertions;

namespace DigitalCommercePlatform.UIServices.Config.Tests.Actions.FindSPA
{
    public class FindSPAActionTest
    {
        private readonly Mock<IConfigService> _mockConfigService;
        private readonly Mock<IMapper> _mapper;

        public FindSPAActionTest()
        {
            _mockConfigService = new();
            _mapper = new Mock<IMapper>();
        }

        public bool Details { get; private set; }

        [Theory]
        [AutoDomainData]
        public async Task GetSPADetails(FindResponse<SpaBase> expected)
        {
            _mockConfigService.Setup(x => x.GetSPADetails(
                      It.IsAny<GetSPA.Request>()
                      ))
                  .ReturnsAsync(expected);
            var handler = new GetSPA.Handler(_mockConfigService.Object, _mapper.Object);

            var request = new GetSPA.Request();

            var result = await handler.Handle(request, It.IsAny<CancellationToken>());

            result.Should().NotBeNull();
        }
    }
}