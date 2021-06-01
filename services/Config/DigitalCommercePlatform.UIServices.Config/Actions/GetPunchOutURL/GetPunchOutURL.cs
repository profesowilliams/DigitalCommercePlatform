using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Services;
using FluentValidation;
using MediatR;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.GetPunchOutURL
{
    [ExcludeFromCodeCoverage]
    public sealed class GetPunchOutURL
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string PostBackURL { get; init; }
            public string Vendor { get; init; }
            public string ConfigurationId { get; init; }
            public string Action { get; init; }
            public string Function { get; init; }
        }

        public class Response
        {
            public string Url { get; set; }
        }

        public class GetPunchOutURLHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IConfigService _configService;

            public GetPunchOutURLHandler(IConfigService configService)
            {
                _configService = configService ?? throw new ArgumentNullException(nameof(configService));
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var punchInDto = new PunchInModel
                {
                    PostBackURL = request.PostBackURL,
                    VendorName = request.Vendor,
                    IdValue = request.ConfigurationId,
                    ActionName = request.Action,
                    FunctionName = request.Function,
                    SalesOrg = "0100",
                    UserId = "techdata-xml-ws",
                    DefaultOrdering = null
                };

                var url = await _configService.GetPunchOutURLAsync(punchInDto);
                return new ResponseBase<Response> { Content = new Response { Url = url } };
            }
        }

        public class GetPunchOutURLValidator : AbstractValidator<Request>
        {
            public GetPunchOutURLValidator()
            {
                RuleFor(i => i.PostBackURL).NotEmpty().WithMessage("PostBackURL is required.");
                RuleFor(i => i.Vendor).NotEmpty().WithMessage("Vendor  is required.");
                RuleFor(i => i.ConfigurationId).NotEmpty().WithMessage("ConfigurationId is required.");
                RuleFor(i => i.Function).NotEmpty().WithMessage("Function is required.");
                RuleFor(i => i.Action).NotEmpty().WithMessage("Action is required.");
            }
        }

    }
}