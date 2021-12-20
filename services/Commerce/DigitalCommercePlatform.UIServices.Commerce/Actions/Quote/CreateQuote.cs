//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using DigitalFoundation.Common.Services.Layer.UI.ExceptionHandling;
using MediatR;
using Microsoft.Extensions.Logging;
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
            public QuotePreviewModel CreateModel { get; set; }

            public Request(QuotePreviewModel createModel)
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

            public Handler(
                ICommerceService quoteService,
                IMapper mapper,
                ILogger<Handler> logger)
            {
                _quoteService = quoteService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                
                var createModelResponse = await _quoteService.CreateQuoteFrom(request);
                var content = new Response
                {
                    QuoteId = createModelResponse.Id,
                    ConfirmationId = createModelResponse.Confirmation,
                };
                
                var response = new ResponseBase<Response> { Content = content };

                if (!string.IsNullOrWhiteSpace(createModelResponse.Id) || !string.IsNullOrWhiteSpace(createModelResponse.Confirmation))
                {
                    return response;
                }

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

            //public class Validator : AbstractValidator<Request>
            //{
            //    public Validator()
            //    {
            //        RuleFor(r => r.CreateModel).Cascade(CascadeMode.Stop).NotNull()
            //            .ChildRules(request =>
            //            {
            //                request.RuleFor(c => c.SalesOrg).NotNull();
            //                request.RuleFor(c => c.TargetSystem).NotNull();
            //                request.RuleFor(c => c.Creator).NotNull();
            //                request.RuleFor(c => c.Type).NotNull();
            //                request.RuleForEach(c => c.Items).SetValidator(new ItemsValidator());
            //                request.RuleFor(c => c.CustomerPo).NotNull();
            //                request.RuleFor(c => c.EndUserPo).NotNull();
            //                request.RuleFor(c => c.EndUser).NotNull();
            //                request.RuleFor(c => c.VendorReference).NotNull();
            //                request.RuleFor(c => c.ShipTo).NotNull();
            //            });
            //    }

            //    public class ItemsValidator : AbstractValidator<Line>
            //    {
            //        public ItemsValidator()
            //        {
            //            RuleFor(c => c.Id).NotNull();
            //            RuleFor(c => c.Quantity).NotNull();
            //            //RuleFor(c => c.TotalPrice).NotNull();
            //            RuleFor(c => c.UnitPrice).NotNull();
            //            //RuleFor(c => c.UnitListPrice).NotNull();
            //            //RuleForEach(c => c.).SetValidator(new ProductValidator());
            //        }
            //    }

            //    public class ProductValidator : AbstractValidator<ProductModel>
            //    {
            //        public ProductValidator()
            //        {
            //            RuleFor(c => c.Id).NotNull().NotEmpty();
            //            RuleFor(c => c.Name).NotNull().NotEmpty();
            //            RuleFor(c => c.Type).NotNull().NotEmpty();
            //        }
            //    }
            //}
        }
    }
}
