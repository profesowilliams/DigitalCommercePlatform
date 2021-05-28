using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Commerce.Infrastructure.ExceptionHandling;
using DigitalCommercePlatform.UIServices.Commerce.Models.Enums;
using DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Create;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
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
                CreateModelResponse createModelResponse;
                switch (request.CreateModelFrom.CreateFromType)
                {
                    case QuoteCreationSourceType.ActiveCart:
                        createModelResponse = await _quoteService.CreateQuoteFromActiveCart(request);
                        break;
                    case QuoteCreationSourceType.SavedCart:
                        createModelResponse = await _quoteService.CreateQuoteFromSavedCart(request);
                        break;
                    case QuoteCreationSourceType.EstimationId:
                        createModelResponse = await _quoteService.CreateQuoteFromEstimationId(request);
                        break;
                    default:
                        throw new UIServiceException("Invalid createFromType: " + request.CreateModelFrom.CreateFromType, (int)UIServiceExceptionCode.GenericBadRequestError);
                }
                var content = new Response
                {
                    QuoteId = createModelResponse.Id,
                    ConfirmationId = createModelResponse.Confirmation,
                };
                var response = new ResponseBase<Response> { Content = content };
                if (createModelResponse.Messages != null)
                {
                    foreach (var message in createModelResponse.Messages)
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
                    RuleFor(r => r.CreateModelFrom).Cascade(CascadeMode.Stop).NotNull()
                        .ChildRules(request =>
                        {
                            request.RuleFor(c => c.CreateFromType).NotNull().IsInEnum();
                            request.RuleFor(c => c).Must(IsValidCreateFromId).WithMessage("'CreateFromId' cannot be null");

                        });
                }
                private bool IsValidCreateFromId(CreateModelFrom r)
                {
                    return (r.CreateFromId != null || r.CreateFromType == QuoteCreationSourceType.ActiveCart);
                }
            }
    }
    }
}
