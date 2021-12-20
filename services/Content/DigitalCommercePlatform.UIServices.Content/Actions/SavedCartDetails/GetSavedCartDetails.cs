//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Content.Models.Cart;
using DigitalCommercePlatform.UIServices.Content.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Content.Actions.SavedCartDetails
{
    [ExcludeFromCodeCoverage]
    public sealed class GetSavedCartDetails
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Id { get; set; }
            public bool IsCartName { get; set; } = false;

            public Request(string id, bool isCartName)
            {
                Id = id;
                IsCartName = isCartName;
            }
        }

        public class Response
        {
            public SavedCartDetailsModel Data { get; set; }
        }

        public class GetCartQueryHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IContentService _contentService;
            private readonly IMapper _mapper;
            private readonly ILogger<GetSavedCartDetails> _logger;

            public GetCartQueryHandler(IContentService contentService, IMapper mapper, ILogger<GetSavedCartDetails> logger)
            {
                _contentService = contentService;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var cartDetails = await _contentService.GetSavedCartDetails(request);
                var getProductResponse = _mapper.Map<Response>(cartDetails);
                return new ResponseBase<Response> { Content = getProductResponse };
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(c => c.Id).NotNull();
            }
        }
    }
}
