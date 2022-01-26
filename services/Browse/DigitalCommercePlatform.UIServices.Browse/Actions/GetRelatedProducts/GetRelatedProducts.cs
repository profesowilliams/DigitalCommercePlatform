//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Dto.RelatedProduct;
using DigitalCommercePlatform.UIServices.Browse.Helpers;
using DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct;
using DigitalCommercePlatform.UIServices.Browse.Models.RelatedProduct.Internal;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetRelatedProducts
{
    public static class GetRelatedProductsHandler
    {
        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ICultureService _cultureService;
            private readonly IMapper _mapper;
            private readonly IBrowseService _productRepositoryServices;
            private readonly ISiteSettings _siteSettings;

            public Handler(IBrowseService productRepositoryServices, ISiteSettings siteSettings, IMapper mapper, ICultureService cultureService)
            {
                _productRepositoryServices = productRepositoryServices;
                _siteSettings = siteSettings;
                _mapper = mapper;
                _cultureService = cultureService;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                RelatedProductTypes relatedProductsTypesConfig = GetRelatedProductTypesFromSiteSettings();
                var requestModel = new RelatedProductRequestDto
                {
                    ProductId = request.ProductId,
                    Type = relatedProductsTypesConfig.Types.Select(x => x.Type).ToArray(),
                    SameManufacturerOnly = request.SameManufacturerOnly
                };
                var result = await _productRepositoryServices.GetRelatedProducts(requestModel).ConfigureAwait(false);

                _cultureService.Process(request.Culture);

                var resultModel = _mapper.Map<RelatedProductResponseModel>(result);
                var response = new Response(resultModel);
                return new ResponseBase<Response> { Content = response };
            }

            private RelatedProductTypes GetRelatedProductTypesFromSiteSettings()
            {
                var defaultRelatedProductType = new RelatedProductType { Type = RelatedProductConstHelper.All, MaximumResults = null };
                var defaultRelatedProductTypes = new RelatedProductTypes { Types = new List<RelatedProductType> { defaultRelatedProductType } };

                var relatedProductsTypesConfigString = _siteSettings.TryGetSetting("Browse.UI.RelatedProductsTypes")?.ToString();
                var relatedProductsTypesConfig = JsonHelper.DeserializeObjectSafely<RelatedProductTypes>(
                    value: relatedProductsTypesConfigString,
                    settings: JsonSerializerSettingsHelper.GetJsonSerializerSettings(),
                    defaultValue: defaultRelatedProductTypes);
                return relatedProductsTypesConfig;
            }
        }

        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Culture { get; set; }
            public string[] ProductId { get; set; }
            public bool SameManufacturerOnly { get; set; }
        }

        public class Response
        {
            public Response(RelatedProductResponseModel items)
            {
                Items = items;
            }

            public RelatedProductResponseModel Items { get; set; }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.ProductId).NotEmpty();
            }
        }
    }
}