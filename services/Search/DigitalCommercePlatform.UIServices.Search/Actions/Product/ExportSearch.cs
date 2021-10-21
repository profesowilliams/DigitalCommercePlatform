//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Search.Dto.FullSearch;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using DigitalFoundation.Common.SimpleHttpClient.Exceptions;
using FluentValidation;
using Flurl;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Actions.Product
{
    public class ExportSearch
    {
        public class Request : IRequest<IEnumerable<ExportResponseModel>>
        {
            public ExportRequestModel Data { get; set; }
        }

        public class Handler : IRequestHandler<Request, IEnumerable<ExportResponseModel>>
        {
            private readonly int _maxResults;
            private const string DisplayStatus = "DisplayStatus";
            private readonly IMiddleTierHttpClient _httpClient;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            private readonly string _appSearchUrl;

            public Handler(IMiddleTierHttpClient httpClient, IMapper mapper, IAppSettings appSettings, ILogger<Handler> logger, ISiteSettings siteSettings)
            {
                _httpClient = httpClient;
                _mapper = mapper;
                _logger = logger;
                _appSearchUrl = appSettings.GetSetting("Search.App.Url");
                _maxResults = siteSettings.GetSetting<int>("Search.UI.Export.MaxProducts");
            }

            public async Task<IEnumerable<ExportResponseModel>> Handle(Request request, CancellationToken cancellationToken)
            {
                var requestDto = _mapper.Map<SearchRequestDto>(request.Data);
                requestDto.PageSize = _maxResults;

                var url = _appSearchUrl.AppendPathSegment("Product");

                SearchResponseDto resultDto = null;

                try
                {
                    resultDto = await _httpClient.PostAsync<SearchResponseDto>(url, null, requestDto).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    if (ex is RemoteServerHttpException { Code: System.Net.HttpStatusCode.NotFound })
                    {
                        return null;
                    }
                    _logger.LogError(ex, "Exception at getting ExportSearch : " + nameof(Handler));
                    throw;
                }

                var models = resultDto.Products.Select(p =>
                {
                    var export = new ExportResponseModel
                    {
                        ManufacturerName = p.CNETManufacturer ?? p.GlobalManufacturer,
                        ManufacturerPartNumber = p.ManufacturerPartNumber,
                        Id = p.Id,
                        UpcNumber = p.UpcEan,
                        TotalStock = p.Stock?.Total ?? 0,
                        ProductStatus = p.Indicators?.FirstOrDefault(x => x.Type == DisplayStatus)?.Value,
                        Description = !string.IsNullOrWhiteSpace(p.LongDescription) ? p.LongDescription : !string.IsNullOrWhiteSpace(p.ShortDescription) ? p.ShortDescription : p.Name,
                        ListPrice = p.Price?.ListPrice,
                        BestPrice = p.Price?.BestPrice,
                        BestPriceExpiration = p.Price?.BestPriceExpiration,
                        PromoIndicator = p.Price != null && p.Price.BasePrice != null && p.Price.BestPrice != null && p.Price.BestPrice != p.Price.BasePrice ? "YES" : "NO",
                        MaximumResults = resultDto.TotalResults <= _maxResults
                    };

                    return export;
                });

                return models;
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Data).NotEmpty();
                When(x => x.Data != null, () =>
                {
                    RuleFor(x => x.Data.SearchString).NotEmpty();
                });
            }
        }
    }
}