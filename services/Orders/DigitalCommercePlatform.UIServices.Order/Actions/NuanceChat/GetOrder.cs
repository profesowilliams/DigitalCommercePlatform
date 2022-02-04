//2021 (c) Tech Data Corporation - All Rights Reserved.
using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Models;
using DigitalCommercePlatform.UIServices.Order.Services;
using DigitalFoundation.Common.Providers.Settings;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.Logging;

namespace DigitalCommercePlatform.UIServices.Order.Actions.NuanceChat
{
    [ExcludeFromCodeCoverage]
    public sealed class GetOrder
    {
       
        public class Request : IRequest<NuanceChatBotResponseModel>
        {
            public NuanceWebChatRequest WbChatRequest { get; set; }
        }
       
        public class Handler : IRequestHandler<Request, NuanceChatBotResponseModel>
        {
            private readonly IOrderService _orderService;
            private readonly IMapper _mapper;
            private readonly IAppSettings _appSettings;
            private readonly ILogger<GetOrder> _logger;

            public Handler(IOrderService orderService, IMapper mapper, IAppSettings appSettings, ILogger<GetOrder> logger)
            {
                _orderService = orderService;
                _mapper = mapper;
                _appSettings = appSettings;
                _logger = logger;
            }
            public async Task<NuanceChatBotResponseModel> Handle(Request request, CancellationToken cancellationToken)
            {
                try
                {
                    var order = await _orderService.GetOrders(request.WbChatRequest);
                    var result = _mapper.Map<NuanceChatBotResponseModel>(order);
                    return ProcessOrder(result, request);
                }
                catch (Exception e)
                {
                    _logger.LogError($"Error while send request {e.Message}");
                    return null;
                }
               
            }
            private NuanceChatBotResponseModel ProcessOrder(NuanceChatBotResponseModel result, Request request)
            {
                if (!string.IsNullOrEmpty(request.WbChatRequest.OrderQuery.LineId))
                {
                    result.Items = result.Items.Where(x => x.LineId == request.WbChatRequest.OrderQuery.LineId)
                        .ToList();
                }
                if (!string.IsNullOrEmpty(request.WbChatRequest.OrderQuery.ManufacturerPartNumber))
                {
                    result.Items = result.Items.Where(x => x.ManufacturerPartNumber == request.WbChatRequest.OrderQuery.ManufacturerPartNumber)
                        .ToList();
                }
                var orderLink = GetOrderLink(result.OrderId);
                if (orderLink != null)
                {
                    result.OrderDetailsLink = orderLink;
                }
                return result;
            }

            private string GetOrderLink(string orderId)
            {
                try
                {
                    var shopUrl = _appSettings.GetSetting("External.ShopOrder.Url");
                    return $"{shopUrl}/{orderId}";
                }
                catch (Exception e)
                {
                    _logger.LogError("Error while getting ShopOrder URL {Message}", e.Message);
                    return null;
                }
            }

        }
        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(r => r).Cascade(CascadeMode.Stop).NotNull()
                    .ChildRules(re =>
                        re.RuleFor(r => r.WbChatRequest).Cascade(CascadeMode.Stop).NotNull()
                            .ChildRules(request =>
                            {

                                request.RuleFor(r => r.OrderQuery.CustomerPo).NotEmpty().When(m => string.IsNullOrEmpty(m.OrderQuery.OrderId));
                                request.RuleFor(r => r.OrderQuery.OrderId).NotEmpty().When(m => string.IsNullOrEmpty(m.OrderQuery.CustomerPo));

                                request.RuleFor(r => r.Header.ResellerId).NotEmpty();
                                request.RuleFor(r => r.Header.Hmac).NotEmpty();
                                request.RuleFor(r => r.Header.LastName).NotEmpty();
                                request.RuleFor(r => r.Header.Name).NotEmpty();
                                request.RuleFor(r => r.Header.EcId).NotEmpty();
                            }));
            }
        }
    }
}
