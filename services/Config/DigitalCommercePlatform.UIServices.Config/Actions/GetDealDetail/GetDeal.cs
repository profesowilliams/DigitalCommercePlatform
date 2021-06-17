using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract;
using DigitalCommercePlatform.UIServices.Config.Models.Deals;
using DigitalCommercePlatform.UIServices.Config.Services;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Actions.GetDealDetail
{
    [ExcludeFromCodeCoverage]
    public sealed class GetDeal
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string DealId { get; set; }
            public string VendorId { get; set; }

            public Request(string dealId, string vendorId)
            {
                DealId = dealId;
                VendorId = vendorId;
            }
        }

        public class Response
        {
            public DealsDetailModel Deals { get; internal set; }
        }

        public class GetDealHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IConfigService _configService;
            private readonly IMapper _mapper;
            private readonly ILogger<GetDealHandler> _logger;

            public GetDealHandler(IConfigService configService,
                IMapper mapper,
                ILogger<GetDealHandler> logger)
            {
                _configService = configService;
                _mapper = mapper;
                _logger = logger;
            }
            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    DealsDetailModel deal = await _configService.GetDealDetails(request);
                    var getDealResponse = _mapper.Map<Response>(deal);
                    return new ResponseBase<Response> { Content = getDealResponse };
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Exception at getting Deal  : " + nameof(GetDeal));
                    throw;
                }


            }
        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.DealId).NotNull();
                RuleFor(x => x.VendorId).NotNull();
            }
        }
    }
}
