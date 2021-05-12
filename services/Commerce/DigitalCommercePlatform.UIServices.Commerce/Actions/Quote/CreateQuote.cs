using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.Quote
{
    [ExcludeFromCodeCoverage]
    public sealed class CreateQuote
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public CreateModel CreateModel { get; set; }

            public Request(CreateModel createModel)
            {
                CreateModel = createModel;
            }
        }

        public class Response
        {
            public QuoteModel QuoteModel { get; }

            public Response(QuoteModel quoteModel)
            {
                QuoteModel = quoteModel;
            }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IMiddleTierHttpClient _httpClient;
            private readonly ILogger<Handler> _logger;
            private readonly IOptions<AppSettings> _appSettings;

            private readonly string _appQuoteKey;

            public Handler(IOptions<AppSettings> appSettings, IMapper mapper, IMiddleTierHttpClient httpClient, ILogger<Handler> logger)
            {
                _httpClient = httpClient;
                _logger = logger;
                _appSettings = appSettings;
                _appQuoteKey = "App.Quote.Url";
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var baseUrl = _appSettings.Value.GetSetting(_appQuoteKey);
                    var url = baseUrl + "/Create";
                    var result = await _httpClient.PostAsync<QuoteModel>(url, null, request.CreateModel);
                    var response = new Response(result);
                    return new ResponseBase<Response> { Content = response };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, $"Error getting quote data in {nameof(CreateQuote)}");
                    throw;
                }
            }

            public class Validator : AbstractValidator<Request>
            {
                public Validator()
                {
                    RuleFor(r => r.CreateModel).Cascade(CascadeMode.Stop).NotNull()
                        .ChildRules(request =>
                        {
                            request.RuleFor(c => c.SalesOrg).NotNull();
                            request.RuleFor(c => c.TargetSystem).NotNull();
                            request.RuleFor(c => c.Creator).NotNull();
                            request.RuleFor(c => c.Type).NotNull();
                            request.RuleForEach(c => c.Items).SetValidator(new ItemsValidator());
                            request.RuleFor(c => c.CustomerPo).NotNull();
                            request.RuleFor(c => c.EndUserPo).NotNull();
                            request.RuleFor(c => c.EndUser).NotNull();
                            request.RuleFor(c => c.VendorReference).NotNull();
                            request.RuleFor(c => c.ShipTo).NotNull();
                        });
                }

                public class ItemsValidator : AbstractValidator<ItemModel>
                {
                    public ItemsValidator()
                    {
                        RuleFor(c => c.Id).NotNull();
                        RuleFor(c => c.Quantity).NotNull();
                        RuleFor(c => c.TotalPrice).NotNull();
                        RuleFor(c => c.UnitPrice).NotNull();
                        RuleFor(c => c.UnitListPrice).NotNull();
                        RuleForEach(c => c.Product).SetValidator(new ProductValidator());
                    }
                }

                public class ProductValidator : AbstractValidator<ProductModel>
                {
                    public ProductValidator()
                    {
                        RuleFor(c => c.Id).NotNull().NotEmpty();
                        RuleFor(c => c.Name).NotNull().NotEmpty();
                        RuleFor(c => c.Type).NotNull().NotEmpty();
                    }
                }
            }
        }
    }
}
