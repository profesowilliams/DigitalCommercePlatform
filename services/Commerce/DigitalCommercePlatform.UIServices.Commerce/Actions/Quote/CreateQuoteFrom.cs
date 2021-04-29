using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.Quote
{
    [ExcludeFromCodeCoverage]
    public sealed class CreateQuoteFrom
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public CreateModelFrom CreateModelFrom { get; set; }

            public Request(CreateModelFrom createModelFrom)
            {
                CreateModelFrom = createModelFrom;
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

            public Handler(ICommerceService quoteService, IMapper mapper, ILogger<Handler> logger)
            {
                _quoteService = quoteService;
                _mapper = mapper;
                _logger = logger;
            }
            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                Response response;
                if (request.CreateModelFrom.CreateFromType == "savedCart")
                {
                    response = await _quoteService.CreateQuoteFromSavedCart(request);
                }
                else
                {
                    response = await _quoteService.CreateQuoteFrom(request);
                }
                return new ResponseBase<Response> { Content = response };
            }

            public class Validator : AbstractValidator<Request>
            {
                public Validator()
                {
                    RuleFor(r => r.CreateModelFrom).Cascade(CascadeMode.Stop).NotNull()
                        .ChildRules(request =>
                        {
                            request.RuleFor(c => c.CreateFromId).NotNull();
                            request.RuleFor(c => c.CreateFromType).NotNull().Must(IsValidCreateFromType).WithMessage("'CreateFromType' must be one of the following values: " + string.Join(", ", CreateFromType.AllowedValues));
                        });
                }

                private bool IsValidCreateFromType(string createTypeFrom)
                {
                    var isValid = CreateFromType.AllowedValues.Contains(createTypeFrom);
                    return isValid;
                }
            }
        }
    }
}
