//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Actions.Content;
using DigitalCommercePlatform.UIServices.Search.Dto.Content;
using DigitalCommercePlatform.UIServices.Search.Models.Content;
using DigitalCommercePlatform.UIServices.Search.Models.Content.App;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Services
{
    public class ContentServiceTests
    {
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly FakeLogger<ContentService> _logger;
        private readonly Mock<IUIContext> _context;
        private readonly ContentService _contentService;

        public ContentServiceTests()
        {
            _logger = new FakeLogger<ContentService>();
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("App.Search.Url")).Returns("http://app-Search/v1");
            _context = new Mock<IUIContext>();
            _contentService = new ContentService(_middleTierHttpClient.Object, _logger, _appSettingsMock.Object, _context.Object);
        }

        [Theory]
        [AutoDomainData]
        public void GetContentThrowsExceptionOtherThanRemoteServerHttpException(AppFullSearchRequestModel request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.GetAsync<ContentSearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                .ThrowsAsync(new Exception("test"));

            //act
            Func<Task> act = async () => await _contentService.GetContentData(request);

            //assert
            act.Should().ThrowAsync<Exception>();
            _middleTierHttpClient.Verify(x => x.GetAsync<ContentSearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetContentThrowsWhenNotFoundReturned(AppFullSearchRequestModel request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.GetAsync<ContentSearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                .ThrowsAsync(new RemoteServerHttpException(message: "test", statusCode: System.Net.HttpStatusCode.NotFound, details: null));

            //act
            var result = await _contentService.GetContentData(request);

            //assert
            result.Should().BeNull();
            _middleTierHttpClient.Verify(x => x.GetAsync<ContentSearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public void GetContentThrowsOtherThanNotFound(AppFullSearchRequestModel request)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.GetAsync<ContentSearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                .ThrowsAsync(new RemoteServerHttpException(message: "test", statusCode: System.Net.HttpStatusCode.InternalServerError, details: null));

            //act
            Func<Task> act = async () => await _contentService.GetContentData(request);

            //assert
            act.Should().ThrowAsync<Exception>();
            _middleTierHttpClient.Verify(x => x.GetAsync<ContentSearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetContentReturnsCorrectResult(AppFullSearchRequestModel request, ContentSearchResponseDto appResponse)
        {
            //Arrange
            _middleTierHttpClient.Setup(x => x.GetAsync<ContentSearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()))
                .Returns(Task.FromResult(appResponse));

            //Act
            var result = await _contentService.GetContentData(request);

            //Assert
            result.Should().NotBeNull();

            _middleTierHttpClient.Verify(x => x.GetAsync<ContentSearchResponseDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>()), Times.Once);
        }
    }
}
