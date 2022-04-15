//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalCommercePlatform.UIServices.Config.Models.SPA;
using DigitalCommercePlatform.UIServices.Config.Services;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail
{
    [ExcludeFromCodeCoverage]
    public sealed class GetDeal
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Id { get; set; }
            public bool Details { get; set; }

            public Request(string id, bool details)
            {
                Id = id;
                Details = details;
            }
        }

        public class Response
        {
            public SpaDetailModel Deal { get; internal set; }
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
                try
                {
                    var deal = await _configService.GetDealDetails(request);
                    var getDealResponse = _mapper.Map<Response>(deal);
                    return new ResponseBase<Response> { Content = getDealResponse };
                }
                catch (Exception ex)
                {
                    Logger.LogError(ex, "Exception at getting Deal  : " + nameof(GetDeal));
                    throw;
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
