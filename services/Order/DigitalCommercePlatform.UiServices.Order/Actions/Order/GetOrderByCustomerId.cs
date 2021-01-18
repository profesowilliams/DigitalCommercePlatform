using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Dto;
using DigitalCommercePlatform.UIServices.Order.DTO;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using FluentValidation;
using Flurl;
using MediatR;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace DigitalCommercePlatform.UIServices.Order.Actions.Order
{
    public sealed class GetOrderByCustomerId
    {
        public class Request : IRequest<Response>
        {
            public List<string> Id { get; set; }
            public int Page { get; set; }
            public int Size { get; set; }
            public string SortBy { get; set; }
            public bool? SortAscending { get; set; }
        }

        public class Response
        {
            public long Count { get; set; }
            public IEnumerable<GetCustomerById> Data { get; set; }
            public Response(IEnumerable<GetCustomerById> orders)
            {
                Data = orders;
            }
        }

        public class Handler : OrderRequestHandler<Request, Response>
        {
            public Handler(
                IMapper mapper,
                ILogger<Handler> logger,
                IMiddleTierHttpClient client,
                IOptions<AppSettings> options) : base(mapper, logger, client, options)
            { }

            protected override void LogError(Exception exception)
                => Logger.LogError(exception, "Exception at: " + nameof(GetOrder));

            protected override async Task<Response> OnHandle(Request request, CancellationToken cancellationToke)
            {
                Logger.LogInformation("AppService.Order.Ids");
                var url = CoreOrder
                    .AppendPathSegment("Customer")
                    .BuildQuery(request);

                var orders = await Client.GetAsync<PaginatedResponse<List<GetCustomerById>>>(url).ConfigureAwait(false);
                var response = Mapper.Map<Response>(orders);
                return response;
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(c => c.Id).NotNull().NotEmpty();
                RuleFor(c => c.Page).GreaterThanOrEqualTo(1);
                RuleFor(c => c.Size).GreaterThanOrEqualTo(1);
            }
        }
    }
}