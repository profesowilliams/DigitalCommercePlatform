//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Search.Models.Redirect;
using DigitalCommercePlatform.UIServices.Search.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Search.Actions.Redirect
{
    public static class KeywordSearch
    {
        public class Request : IRequest<Response>
        {
            public string Keyword { get; set; }

            public Request(string keyword)
            {
                Keyword = keyword;
            }
        }

        public class Response
        {
            public RedirectModel Results { get; set; }

            public Response()
            { }

            public Response(RedirectModel result)
            {
                Results = result;
            }
        }

        public class Handler : IRequestHandler<Request, Response>
        {
            private readonly ILogger<Handler> _logger;
            private readonly IRedirectService _redirectService;

            public Handler(ILogger<Handler> logger, IRedirectService redirectService)
            {
                _logger = logger;
                _redirectService = redirectService;
            }

            public async Task<Response> Handle(Request request, CancellationToken cancellationToken)
            {
                var data = await _redirectService.GetRedirects(request.Keyword);

                if (data?.SearchResults?.Any() != true)
                    return new Response();

                var model = new RedirectModel
                {
                    Name = data?.SearchResults?.First().Title,
                    Url = data?.SearchResults?.First().Url,
                    ExactMatch = data?.SearchResults?.Any() == true
                };

                return new Response(model);
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(r => r.Keyword).NotNull().NotEmpty();
            }
        }
    }
}