//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Actions.Content;
using DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles;
using DigitalCommercePlatform.UIServices.Search.Dto.Content;
using DigitalCommercePlatform.UIServices.Search.Models.Content;
using DigitalCommercePlatform.UIServices.Search.Services;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using FluentValidation.TestHelper;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.Actions.Content
{
    public class FullSearchTests
    {
        private readonly Mock<IContentService> _contentServiceMock;
        private readonly FakeLogger<FullSearch.Handler> _logger;
        private readonly Mapper _mapper;

        public FullSearchTests()
        {
            _logger = new FakeLogger<FullSearch.Handler>();
            _contentServiceMock = new Mock<IContentService>();
            _mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile(new SearchProfile())));
        }

        [Theory]
        [AutoDomainData]
        public void HandleThrowsExceptionOtherThanRemoteServerHttpException(FullSearch.Request request)
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
        public void HandleReturnsError(FullSearch.Request request)
        {
            //arrange
            _contentServiceMock.Setup(x => x.GetContentData(It.IsAny<FullSearchRequestDto>())).ThrowsAsync(new Exception("test"));

            var sut = GetHandler();

            //act
            Func<Task> act = async () => await sut.Handle(request, default);
            //assert
            _ = act.Should().ThrowAsync<Exception>();
            _contentServiceMock.Verify(x => x.GetContentData(It.IsAny<FullSearchRequestDto>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleReturnsNullWhenNotFoundReturned(FullSearch.Request request)
        {
            //arrange
            _contentServiceMock.Setup(x => x.GetContentData(It.IsAny<FullSearchRequestDto>())).Returns(Task.FromResult(new ContentSearchResponseDto()));

            var sut = GetHandler();

            //act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            //assert
            result.Should().NotBeNull();
            result.Results.Should().NotBeNull();
            _contentServiceMock.Verify(x => x.GetContentData(It.IsAny<FullSearchRequestDto>()), Times.Once);
        }

        [Theory]
        [AutoDomainData]
        public void ValidatorReturnValidWhenValidRequest(FullSearch.Request request)
        {
            //arrange
            var sut = new FullSearch.Validator();

            //act
            var result = sut.TestValidate(request);

            //assert
            result.ShouldNotHaveAnyValidationErrors();
        }

        [Fact]
        public void ValidationThrowsErrorForMissingSearchStringInvalidRequest()
        {
            //arrange
            var sut = new FullSearch.Validator();
            var request = new FullSearch.Request(new Models.Content.FullSearchRequestModel());

            //act
            var result = sut.TestValidate(request);

            //assert
            result.ShouldHaveValidationErrorFor(r => r.FullSearchRequestModel.Keyword);
        }

        [Theory]
        [AutoDomainData]
        public async Task HandleReturnsCorrectResult(FullSearch.Request request, ContentSearchResponseDto appResponse)
        {
            //Arrange
            _contentServiceMock.Setup(x => x.GetContentData(It.IsAny<FullSearchRequestDto>())).Returns(Task.FromResult(appResponse));
            var sut = GetHandler();

            //Act
            var result = await sut.Handle(request, default).ConfigureAwait(false);

            //Assert
            result.Results.Should().NotBeNull();

            _contentServiceMock.Verify(x => x.GetContentData(It.IsAny<FullSearchRequestDto>()), Times.Once);
        }

        private FullSearch.Handler GetHandler() => new(_contentServiceMock.Object, _logger, _mapper);
    }
}
