using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Commerce.Infrastructure.ExceptionHandling;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Settings;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
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
            public string QuoteId { get; set; }
            public string ConfirmationId { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ICommerceService _quoteService;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(ICommerceService quoteService, IMapper mapper, IMiddleTierHttpClient httpClient, ILogger<Handler> logger)
            {
                _quoteService = quoteService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var createModelResponse = await _quoteService.CreateQuote(request);
                var content = new Response
                {
                    QuoteId = createModelResponse.Id,
                    ConfirmationId = createModelResponse.Confirmation,
                };
                var response = new ResponseBase<Response> { Content = content };
                if (createModelResponse.Messages != null)
                {
                    foreach (var message in createModelResponse?.Messages)
                    {
                        response.Error.Code = (int)UIServiceExceptionCode.QuoteCreationFailed;
                        response.Error.IsError = true;
                        response.Error.Messages.Add(message.Value);
                    }
                }
                return response;
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
