using AutoMapper;
using DigitalCommercePlatform.UIServices.Account.Services;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using System.Diagnostics.CodeAnalysis;
using DigitalCommercePlatform.UIServices.Account.Actions.Abstract;
using FluentValidation;
using DigitalCommercePlatform.UIServices.Account.Models.Configurations;

namespace DigitalCommercePlatform.UIServices.Account.Actions.GetConfigurationsFor
{
    [ExcludeFromCodeCoverage]
    public static class GetConfigurationsFor
    {
        public enum RequestType
        {
            ConfigurationId = 1,
            VendorQuote = 2,
            DealId = 3,
        }

        public class Request : IRequest<ResponseBase<Response>>
        {
            public RequestType RequestType { get; }
            public bool GetAll { get; set; }
            public int Count { get; set; } 

            public Request(RequestType requestType, bool getAll = false, int count = 100)
            {
                GetAll = getAll;
                Count = count;
                RequestType = requestType;
            }
        }

        public class Response
        {
            public GetConfigurationsForModel ConfigurationsData { get; internal set; }            
        }

        public class GetConfigurationsForHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IAccountService _accountServices;
            private readonly IMapper _mapper;
            private readonly ILogger<GetConfigurationsForHandler> _logger;

            public GetConfigurationsForHandler(IAccountService accountServices, 
                IMapper mapper, 
                ILogger<GetConfigurationsForHandler> logger)
            {
                _accountServices = accountServices;
                _mapper = mapper;
                _logger = logger;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var configurationsModel = await _accountServices.GetConfigurationsForAsync(request);
                    return new ResponseBase<Response> { Content = new Response { ConfigurationsData = configurationsModel } };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting data for quotes : " + nameof(GetConfigurationsFor));
                    throw;
                }
            }
        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.GetAll).NotNull();
                RuleFor(x => x.Count).NotNull().GreaterThanOrEqualTo(0);
                RuleFor(x => x.RequestType).IsInEnum();
            }
        }
    }
}
