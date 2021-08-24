//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.GetPricingCondition
{
    [ExcludeFromCodeCoverage]
    public sealed class GetPricingConditions
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Id { get; }
            public bool GetAll { get; } = true;

            public Request(bool getAll, string id)
            {
                Id = id;
                GetAll = getAll;
            }
        }

        public class Response
        {
            public PricingConditionsModel PricingConditions { get; set; }
        }

        public class GetPricingConditionsHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ICommerceService _commerceQueryService;
            private readonly IMapper _mapper;

            public GetPricingConditionsHandler(ICommerceService commerceQueryService, IMapper mapper)
            {
                _commerceQueryService = commerceQueryService;
                _mapper = mapper;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var pricing = await _commerceQueryService.GetPricingConditions(request);
                //var pricingResponse = _mapper.Map<GetPricingConditions>(pricing);
                var response = new Response
                {
                    PricingConditions = pricing
                };
                return new ResponseBase<Response> { Content = response };
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(c => c.Id).NotEmpty();
            }
        }
    }
}
