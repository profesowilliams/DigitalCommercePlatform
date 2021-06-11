using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Config.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.EstimationValidate
{
    [ExcludeFromCodeCoverage]
    public class EstimationValidate
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Id { get; set; }
        }

        public class Response
        {
            public bool IsValid { get; set; }
        }

        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            private readonly IConfigService _configService;

            public Handler(IMapper mapper, ILogger<Handler> logger, IConfigService configService)
            {
                _mapper = mapper;
                _logger = logger;
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
                RuleFor(x => x.Id)
                    .NotEmpty()
                    .MinimumLength(MinIdLength)
                    .MaximumLength(MaxIdLength);

                RuleFor(x => x.Id).Must(CheckAllChars).WithMessage("Id contains invalid characters");
            }

            public bool CheckAllChars(string id)
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
