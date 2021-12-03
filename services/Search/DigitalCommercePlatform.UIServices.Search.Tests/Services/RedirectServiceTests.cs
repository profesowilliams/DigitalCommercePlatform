//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Dto.Content;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Client.Exceptions;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Services
{
    public class RedirectServiceTests
    {
        private readonly Mock<IMiddleTierHttpClient> _middleTierHttpClient;
        private readonly Mock<IAppSettings> _appSettingsMock;
        private readonly ILogger<RedirectService> _logger;

        public RedirectServiceTests()
        {
            _logger = new FakeLogger<RedirectService>();
            _middleTierHttpClient = new Mock<IMiddleTierHttpClient>();
            _appSettingsMock = new Mock<IAppSettings>();
            _appSettingsMock.Setup(s => s.GetSetting("Search.App.Url")).Returns("http://app-Search/v1");
        }

        [Theory]
        [AutoDomainData]
        public void GetRedirectThrowsExceptionOtherThanRemoteServerHttpException(string keyword)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.GetAsync<ContentDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), null))
                .ThrowsAsync(new Exception("test"));

            //act
            Func<Task> act = async () => await GetService().GetRedirects(keyword);

            //assert
            act.Should().ThrowAsync<Exception>();
            _middleTierHttpClient.Verify(x => x.GetAsync<ContentDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), null), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetRedirectThrowsWhenNotFoundReturned(string keyword)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.GetAsync<ContentDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), null))
                .ThrowsAsync(new RemoteServerHttpException(message: "test", statusCode: System.Net.HttpStatusCode.NotFound, details: null));

            //act
            var result = await GetService().GetRedirects(keyword);

            //assert
            result.Should().BeNull();
            _middleTierHttpClient.Verify(x => x.GetAsync<ContentDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), null), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public void GetRedirectThrowsOtherThanNotFound(string keyword)
        {
            //arrange
            _middleTierHttpClient.Setup(x => x.GetAsync<ContentDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), null))
                .ThrowsAsync(new RemoteServerHttpException(message: "test", statusCode: System.Net.HttpStatusCode.InternalServerError, details: null));

            //act
            Func<Task> act = async () => await GetService().GetRedirects(keyword);

            //assert
            act.Should().ThrowAsync<Exception>();
            _middleTierHttpClient.Verify(x => x.GetAsync<ContentDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), null), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task GetContentReturnsCorrectResult(string keyword, ContentDto response)
        {
            //Arrange
            _middleTierHttpClient.Setup(x => x.GetAsync<ContentDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), null))
                .ReturnsAsync(response);

            //Act
            var result = await GetService().GetRedirects(keyword);

            //Assert
            result.Should().NotBeNull();

            _middleTierHttpClient.Verify(x => x.GetAsync<ContentDto>(It.IsAny<string>(), It.IsAny<IEnumerable<object>>(), It.IsAny<IDictionary<string, object>>(), null), Times.Once);
        }

        private RedirectService GetService() => new(_middleTierHttpClient.Object, _logger, _appSettingsMock.Object);
    }
}