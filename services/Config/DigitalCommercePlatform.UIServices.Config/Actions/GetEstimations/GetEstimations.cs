using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Estimations;
using DigitalCommercePlatform.UIServices.Config.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.GetEstimations
{
    [ExcludeFromCodeCoverage]
    public class GetEstimations
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
            public IEnumerable<Estimation> Items { get; set; }
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
                try
                {
                    var estimations = await _configService.FindEstimations(request).ConfigureAwait(false);
                    var getEstimationsContent = new Response
                    {
                        Items = estimations,
                    };
                    return new ResponseBase<Response> { Content = getEstimationsContent };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at searching estimations, Handler : " + nameof(Handler));
                    throw;
                }
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                
            }
        }
    }
}
