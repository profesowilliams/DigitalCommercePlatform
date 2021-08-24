//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Commerce.Models;
using DigitalCommercePlatform.UIServices.Commerce.Services;
using DigitalFoundation.Common.Services.Actions.Abstract;
using FluentValidation;
using MediatR;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.GetOrderLines
{
    [ExcludeFromCodeCoverage]
    public sealed class GetLines
    {
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Id { get; }

            public Request(string id)
            {
                Id = id;
            }
        }

        public class Response
        {
            public IEnumerable<Line> Items { get; set; }
        }

        public class GetOrderLinesHandler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly ICommerceService _commerceQueryService;
            private readonly IMapper _mapper;

            public GetOrderLinesHandler(ICommerceService commerceQueryService,
                IMapper mapper)
            {
                _commerceQueryService = commerceQueryService ?? throw new ArgumentNullException(nameof(commerceQueryService));
                _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                var order = await _commerceQueryService.GetOrderByIdAsync(request.Id);
                Response orderLinesResponse;
                if (order == null)
                {
                    orderLinesResponse = new Response
                    {
                        Items = null
                    };
                }
                else
                {
                    var linesDto = _mapper.Map<IEnumerable<Line>>(order.Items);
                    orderLinesResponse = new Response
                    {
                        Items = linesDto
                    };
                }

                return new ResponseBase<Response> { Content = orderLinesResponse };
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
