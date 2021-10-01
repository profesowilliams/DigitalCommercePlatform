//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Actions.Redirect;
using DigitalCommercePlatform.UIServices.Search.Dto.Content;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using FluentValidation.TestHelper;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Threading.Tasks;
using Xunit;
using static DigitalCommercePlatform.UIServices.Search.Actions.Redirect.KeywordSearch;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Actions.Redirect
{
    public class KeywordSearchTests
    {
        private readonly Mock<ILogger<Handler>> _logger;
        private readonly Mock<IRedirectService> _redirectService;

        public KeywordSearchTests()
        {
            _logger = new();
            _redirectService = new();
        }

        [Theory]
        [AutoDomainData]
        public void HandleThrowsExceptionOtherThanRemoteServerHttpException(Request request)
        {
            //arrange

            var sut = GetHandler();

            //act
            Func<Task> act = async () => await sut.Handle(request, default);

            //assert
            act.Should().ThrowAsync<Exception>();
        }

        [Theory]
        [AutoDomainData]
        public void HandleReturnsError(Request request)
        {
            //arrange
            _redirectService.Setup(x => x.GetRedirects(It.IsAny<string>())).ThrowsAsync(new Exception("test"));

            var sut = GetHandler();

            //act
            Func<Task> act = async () => await sut.Handle(request, default);
            //assert
            _ = act.Should().ThrowAsync<Exception>();
            _redirectService.Verify(x => x.GetRedirects(It.IsAny<string>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleReturnsNullWhenNotFoundReturned(Request request)
        {
            //arrange
            _redirectService.Setup(x => x.GetRedirects(It.IsAny<string>())).ReturnsAsync(new Dto.Content.ContentDto());

            var sut = GetHandler();

            //act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            //assert
            result.Should().NotBeNull();
            result.Results.Should().BeNull();
            _redirectService.Verify(x => x.GetRedirects(It.IsAny<string>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleReturns(Request request, ContentDto response)
        {
            //arrange
            _redirectService.Setup(x => x.GetRedirects(It.IsAny<string>())).ReturnsAsync(response);

            var sut = GetHandler();

            //act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            //assert
            result.Should().NotBeNull();
            result.Results.Should().NotBeNull();
            _redirectService.Verify(x => x.GetRedirects(It.IsAny<string>()), Times.Once);
        }

        [Theory]
        [InlineData("")]
        [InlineData(null)]
        public void Validator_ReturnFalse_WhenNotValid(string keyword)
        {
            //arrange
            var request = new Request(keyword);
            var sut = new Validator();

            //act
            var results = sut.TestValidate(request);

            //assert
            results.ShouldHaveValidationErrorFor(x => x.Keyword);
        }

        [Fact]
        public void Validator_ReturnTrue_WhenValid()
        {
            //arrange
            var request = new Request("test");

            var sut = new Validator();

            //act
            var results = sut.TestValidate(request);

            //assert
            results.ShouldNotHaveAnyValidationErrors();
        }

        private KeywordSearch.Handler GetHandler() => new(_logger.Object, _redirectService.Object);
    }
}