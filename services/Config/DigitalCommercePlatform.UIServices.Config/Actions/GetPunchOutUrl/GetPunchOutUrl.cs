//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
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

namespace DigitalCommercePlatform.UIServices.Config.Actions.GetPunchOutUrl
{
    [ExcludeFromCodeCoverage]
    public sealed class GetPunchOutUrl
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string PostBackUrl { get; set; }
            public string Vendor { get; set; }
            public string ConfigurationId { get; set; }
            public string Action { get; set; } = "create";
            public string Function { get; set; }
        }

        public class Response
        {
            public string Url { get; set; }
        }

        public class Handler : HandlerBase<Handler>, IRequestHandler<Request, ResponseBase<Response>>
        {
            protected readonly IMapper _mapper;
            protected readonly IConfigService _configService;

            public Handler(
                IMapper mapper,
                ILoggerFactory loggerFactory,
                IConfigService configService,
                IHttpClientFactory httpClientFactory)
                : base(loggerFactory, httpClientFactory)
            {
                _mapper = mapper;
                _configService = configService;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var punchInDto = new PunchInModel
                {
                    PostBackUrl = request.PostBackUrl,
                    VendorName = request.Vendor,
                    IdValue = request.ConfigurationId,
                    ActionName = request.Action,
                    FunctionName = request.Function,
                    SalesOrg = "0100",
                    UserId = "techdata-xml-ws",
                    DefaultOrdering = null
                };

                var url = await _configService.GetPunchOutUrlAsync(punchInDto);
                if (url == "This Config ID is not recognized")
                     return new ResponseBase<Response> { Error = new ErrorInformation { Messages = { url } } };
                else
                    return new ResponseBase<Response> { Content = new Response { Url = url } };
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(i => i.PostBackUrl)
                    .NotEmpty().WithMessage("PostBackUrl is required.");
                RuleFor(i => i.Vendor)
                    .NotEmpty().WithMessage("Vendor  is required.");
                RuleFor(i => i.Action)
                   .NotEmpty().WithMessage("Action is required.");
                RuleFor(i => i.Function)
                    .NotEmpty().WithMessage("Function is required.");
                //When(i => i.Action.ToLower().Equals("edit"), () =>
                //{
                //    RuleFor(i => i.ConfigurationId)
                //  .NotEmpty().WithMessage("ConfigurationId is required.");
                //}).Otherwise(() =>
                //{
                //    RuleFor(i => i.ConfigurationId)
                //.Empty().WithMessage("ConfigurationId is not required while creating configuration.");
                //});
            }
        }
    }
}

