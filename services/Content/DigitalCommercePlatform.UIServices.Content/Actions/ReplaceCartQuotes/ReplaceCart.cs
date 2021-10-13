//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Content.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Content.Actions.ReplaceCartQuotes
{
    public class ReplaceCart
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Id { get; set; }
            public string Type { get; set; }

            public Request(string id, string type)
            {
                Id = id;
                Type = type;
            }
        }

        public class Response
        {
            public bool IsSuccess { get; set; }

        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IContentService _contentServices;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;

            public Handler(IContentService contentServices, IMapper mapper, ILogger<Handler> logger)
            {
                _contentServices = contentServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                request.Type = request.Type ?? string.Empty;

                if (request.Type.ToLower() == "quote")
                {
                    var isSucess = await _contentServices.ReplaceCart(request.Id).ConfigureAwait(false);
                    var response = new Response
                    {
                        IsSuccess = isSucess
                    };
                    return new ResponseBase<Response> { Content = response };
                }
                else
                {
                    return new ResponseBase<Response> { Error = new ErrorInformation { Messages = { "Error while calling Type " + request.Type + " and Id : "+request.Id } } };
                }
            }
        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Id).NotNull();
            }
        }
    }
}
