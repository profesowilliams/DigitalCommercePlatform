using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Dto.SalesOrder;
using DigitalCommercePlatform.UIServices.Order.Models.SalesOrder;
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
    public sealed class FindOrder
    {
        public class Request : IRequest<Response>
        {
            public FindRequestModel SearchQuery { get; set; }
        }

        public class Response
        {
            public long Count { get; set; }
            public IEnumerable<SalesOrderModel> Data { get; set; }
            public Response(IEnumerable<SalesOrderModel> orders)
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
                => Logger.LogError(exception, "Exception at: " + nameof(FindOrder));

            protected override async Task<Response> OnHandle(Request request, CancellationToken cancellationToke)
            {
                Logger.LogInformation("AppService.Order.Ids");

                var coreCriteria = Mapper.Map<FindRequestDto>(request.SearchQuery);

                var countTask = GetCount(request.SearchQuery.WithPaginationInfo, coreCriteria);
                var listTask = GetModelList(coreCriteria);

                var count = countTask != null ? countTask.Result : 0;
                var modelList = await listTask.ConfigureAwait(false);

                return new Response(modelList) { Count = count };
            }

            private Task<long> GetCount(bool withPaginationInfo, FindRequestDto coreCriteria)
            {
                Task<long> countTask = null;

                if (withPaginationInfo)
                {
                    var countPath = CoreOrder
                        .AppendPathSegment("SalesOrder")
                        .AppendPathSegment("Count")
                        .BuildQuery(coreCriteria);

                    Logger.LogInformation($"Getting: {countPath}");

                    countTask = Client.GetAsync<long>(countPath);
                }

                return countTask;
            }

            private async Task<List<SalesOrderModel>> GetModelList(FindRequestDto coreCriteria)
            {
                var requestPath = CoreOrder
                    .AppendPathSegment("SalesOrder")
                    .AppendPathSegment("Find")
                    .BuildQuery(coreCriteria);

                Logger.LogInformation($"Getting: {requestPath}");

                var coreList = await Client.GetAsync<List<SalesOrderDto>>(requestPath).ConfigureAwait(false);
                var modelList = Mapper.Map<List<SalesOrderModel>>(coreList);

                return modelList;
            }
        }

        //public class Validator : AbstractValidator<Request>
        //{
        //    public Validator()
        //    {
        //        RuleFor(r => r).Cascade(CascadeMode.Stop).NotNull()
        //        .ChildRules(re =>
        //        re.RuleFor(r => r.SearchQuery).Cascade(CascadeMode.Stop).NotNull()
        //        .ChildRules(request =>
        //        {
        //            request.RuleFor(r => r.Page).GreaterThanOrEqualTo(0);
        //            request.RuleFor(r => r.PageSize).GreaterThan(0);
        //            request.RuleFor(r => r.CreatedFrom).LessThan(DateTime.Now)
        //                .WithMessage($"{nameof(Request.SearchQuery.CreatedFrom)} can't be in the future.");

        //            request.RuleFor(r => r.CreatedTo).LessThanOrEqualTo(DateTime.Now)
        //                .WithMessage($"{nameof(Request.SearchQuery.CreatedTo)} can't be in the future.");
        //        }));
        //    }
        //}
    }
}