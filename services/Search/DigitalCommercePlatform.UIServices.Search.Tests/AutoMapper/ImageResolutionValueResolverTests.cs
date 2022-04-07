//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Features.Image;
using DigitalFoundation.Common.TestUtilities;
using FluentAssertions;
using Moq;
using System.Collections.Generic;
using System.Linq;
using Xunit;

namespace DigitalCommercePlatform.UIServices.Search.Tests.AutoMapper
{
    public class ImageResolutionValueResolverTests
    {
        private const string _resolution = "800x400";
        private readonly Mock<IImageResolutionService> _imageResolutionService;
        private readonly Mock<ISiteSettings> _siteSettings;
        private readonly ImageResolutionValueResolver _sut;

        public ImageResolutionValueResolverTests()
        {
            _imageResolutionService = new Mock<IImageResolutionService>();
            _siteSettings = new Mock<ISiteSettings>();
            _siteSettings.Setup(s => s.GetSetting(It.Is<string>(s => s == "Search.UI.ProductImageSize")))
                .Returns(_resolution);

            _sut = new ImageResolutionValueResolver(_siteSettings.Object, _imageResolutionService.Object);
        }

        public static List<object[]> GetProductWhithNoImages =>
            new()
            {
                new object[] { new ElasticItemDto { ProductImages = null } },
                new object[] { new ElasticItemDto { ProductImages = new Dictionary<string, List<ImageDto>>() } },
            };

        [Theory]
        [AutoDomainData()]
        public void Resolve_WithDefaultImage(string url, string type, string angle)
        {
            //arrange
            var product = new ElasticItemDto { ProductImages = new Dictionary<string, List<ImageDto>>() };
            product.ProductImages.Add(ImageResolutionValueResolver.DefaultImageResolution, new List<ImageDto>
                {
                    new ImageDto { Url = url, Type = type, Angle = angle}
                });

            //act
            var result = _sut.Resolve(product, null, null, null);

            //arrange
            _imageResolutionService.Verify(i => i.GetResolution(It.IsAny<string>(), It.IsAny<ICollection<string>>()), Times.Never);
            result.Should().NotBeNull();
            var firstImage = result.First();
            firstImage.Url.Should().Be(url);
            firstImage.Type.Should().Be(type);
            firstImage.Angle.Should().Be(angle);
        }

        [Theory]
        [AutoDomainData(nameof(GetProductWhithNoImages))]
        public void Resolve_WithNoImages(ElasticItemDto product)
        {
            //arrange-act
            var result = _sut.Resolve(product, null, null, null);

            //arrange
            _imageResolutionService.Verify(i => i.GetResolution(It.IsAny<string>(), It.IsAny<ICollection<string>>()), Times.Never);
            result.Should().BeNull();
        }

        [Theory]
        [AutoDomainData()]
        public void Resolve_WithResolution(ElasticItemDto product, string url, string type, string angle)
        {
            //arrange
            _imageResolutionService.Setup(i => i.GetResolution(It.Is<string>(s => s == _resolution), It.IsAny<ICollection<string>>()))
                .Returns(_resolution)
                .Verifiable();
            product.ProductImages.Add(_resolution, new List<ImageDto>
                {
                    new ImageDto { Url = url, Type = type, Angle = angle }
                });

            //act
            var result = _sut.Resolve(product, null, null, null);

            //arrange
            _siteSettings.Verify(s => s.GetSetting(It.Is<string>(s => s == "Search.UI.ProductImageSize")), Times.Once);
            _imageResolutionService.Verify();
            result.Should().NotBeNull();
            var firstImage = result.First();
            firstImage.Url.Should().Be(url);
            firstImage.Type.Should().Be(type);
            firstImage.Angle.Should().Be(angle);
        }
    }
}