//2022 (c) TD Synnex - All Rights Reserved.

using DigitalCommercePlatform.UIServices.Browse.Dto.Price;
using DigitalCommercePlatform.UIServices.Browse.Helpers;
using DigitalCommercePlatform.UIServices.Browse.Models.Spa;
using DigitalCommercePlatform.UIServices.Browse.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Providers.Settings;
using DnsClient.Internal;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.Actions.GetSpa
{
    public class GetSpaHandler
    {
        public class Request : IRequest<IEnumerable<SpaResponseModel>>
        {
            public string Id { get; set; }
            public string Culture { get; set; }
        }

        public class Handler : IRequestHandler<Request, IEnumerable<SpaResponseModel>>
        {
            private readonly IMiddleTierHttpClient _httpClient;
            private readonly ILogger<Handler> _logger;
            private readonly ICultureService _cultureService;
            private readonly string _appPriceBaseUrl;

            public Handler(IMiddleTierHttpClient httpClient, IAppSettings appSettings, ILogger<Handler> logger, ICultureService cultureService)
            {
                _httpClient = httpClient;
                _logger = logger;
                _cultureService = cultureService;
                _appPriceBaseUrl = appSettings.GetSetting("App.Price.Url");
            }

            public async Task<IEnumerable<SpaResponseModel>> Handle(Request request, CancellationToken cancellationToken)
            {
                var priceRequest = new PriceRequestDto(request.Id);

                try
                {
                    var dtos = await _httpClient.PostAsync<IEnumerable<PriceResponseDto>>(_appPriceBaseUrl, body: priceRequest);

                    var productPrice = dtos.SingleOrDefault();//asking for one product, so if more returned that is exception
                    if (productPrice?.EndUserPromos?.Any() != true)
                        return Array.Empty<SpaResponseModel>();

                    _cultureService.Process(request.Culture);

                    return productPrice.EndUserPromos.Select(x => new SpaResponseModel
                    {
                        EndUserName = x.EndCustomer,
                        ExpirationDate = x.Expiration.Format(),
                        MinimumQuantity = x.MinQuantity.Format("0"),
                        RemainingQuantity = x.RemainingQuantity.Format(),
                        VendorBidNumber = x.VendorBidNumber,
                        Price = x.Value.HasValue ? x.Value.Value.Format(productPrice.Currency) : null
                    });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at GetSpaHandler with ProductId: {ProductId}", request.Id);
                    return Array.Empty<SpaResponseModel>();
                }
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Id).NotEmpty();
            }
        }
    }
}