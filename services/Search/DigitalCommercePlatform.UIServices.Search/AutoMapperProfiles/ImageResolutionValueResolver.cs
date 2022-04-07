//2022 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch.Internal;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch.Internal;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Features.Image;
using System.Collections.Generic;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles
{
    public class ImageResolutionValueResolver : IValueResolver<ElasticItemDto, ElasticItemModel, List<ImageModel>>
    {
        public const string DefaultImageResolution = "default";
        private readonly IImageResolutionService _imageResolutionService;
        private readonly string _productImageSize;

        public ImageResolutionValueResolver(ISiteSettings siteSettings, IImageResolutionService imageResolutionService)
        {
            _productImageSize = siteSettings.GetSetting("Search.UI.ProductImageSize");
            _imageResolutionService = imageResolutionService;
        }

        public List<ImageModel> Resolve(ElasticItemDto source, ElasticItemModel destination, List<ImageModel> destMember, ResolutionContext context)
        {
            var imagesModel = new List<ImageModel>();

            if (source.ProductImages == null || !source.ProductImages.Any())
            {
                return null;
            }

            if (TryGetDefaultImage(source.ProductImages, out var defaultImage))
            {
                imagesModel.Add(new ImageModel
                {
                    Angle = defaultImage.Angle,
                    Url = defaultImage.Url,
                    Type = defaultImage.Type,
                });
                return imagesModel;
            }

            var resolution = _imageResolutionService.GetResolution(_productImageSize, source.ProductImages.Keys);
            if (resolution != null)
            {
                imagesModel.AddRange(source.ProductImages[resolution].Select(i => new ImageModel
                {
                    Angle = i.Angle,
                    Url = i.Url,
                    Type= i.Type,
                }));
            }

            return imagesModel.Any() ? imagesModel : null;
        }

        private static bool TryGetDefaultImage(IDictionary<string, List<ImageDto>> images, out ImageDto outImage)
        {
            outImage = null;

            if (images.Count == 1 && images.ContainsKey(DefaultImageResolution))
            {
                outImage = images[DefaultImageResolution].First();
                return true;
            }

            return false;
        }
    }
}