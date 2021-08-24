//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate
{
    [ExcludeFromCodeCoverage]
    public class EstimationValidate
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public FindModel Criteria { get; set; }

            public Request()
            {
                Criteria = new FindModel();
            }

            public Request(FindModel model)
            {
                Criteria = model;
            }
        }

        public class Response
        {
            public bool IsValid { get; set; }
        }

        public class Handler : HandlerBase<Handler>, IRequestHandler<Request, ResponseBase<Response>>
        {
            protected readonly IConfigService _configService;

            public Handler(
                ILoggerFactory loggerFactory,
                IConfigService configService,
                IHttpClientFactory httpClientFactory)
                : base(loggerFactory, httpClientFactory)
            {
                _configService = configService;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var isValid = await _configService.EstimationValidate(request).ConfigureAwait(false);
                var estimationValidateContent = new Response
                {
                    IsValid = isValid
                };
                return new ResponseBase<Response> { Content = estimationValidateContent };
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public static readonly int MinIdLength = 2;
            public static readonly int MaxIdLength = 255;
            public static readonly string ValidChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            public Validator()
            {
                RuleFor(x => x.Criteria.Id).Cascade(CascadeMode.Stop)
                    .NotEmpty()
                    .MinimumLength(MinIdLength)
                    .MaximumLength(MaxIdLength)
                    .Must(ContainsValidCharsOnly)
                        .WithMessage("Id contains invalid characters");
            }

            private static bool ContainsValidCharsOnly(string id)
            {
                var result = true;
                foreach (char c in id)
                {
                    if (!ValidChars.Contains(c))
                    {
                        result = false;
                        break;
                    }
                }
                return result;
            }
        }
    }
}
