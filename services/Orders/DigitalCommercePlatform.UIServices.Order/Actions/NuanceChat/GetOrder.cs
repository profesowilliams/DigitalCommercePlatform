//2021 (c) Tech Data Corporation - All Rights Reserved.
using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Models;
using DigitalCommercePlatform.UIServices.Order.Services;
using DigitalFoundation.Common.Settings;
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
            private readonly ILogger<GetOrder> _logger;

            public Handler(IOrderService orderService, IMapper mapper, ILogger<GetOrder> logger)
            {
                _orderService = orderService;
                _mapper = mapper;
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
                    throw;
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
                return result;
            }
          
        }
        public class Validator : AbstractValidator<Request>
        {
            private readonly IAppSettings _appSettings;
            public Validator(IAppSettings appsettings)
            {
                _appSettings = appsettings;
                RuleFor(r => r).Cascade(CascadeMode.Stop).NotNull()
                    .ChildRules(re =>
                        re.RuleFor(r => r.WbChatRequest).Cascade(CascadeMode.Stop).NotNull()
                            .ChildRules(request =>
                            {
                               
                                request.RuleFor(r => r.OrderQuery.CustomerPo).NotEmpty().When(m => string.IsNullOrEmpty(m.OrderQuery.OrderId));
                                request.RuleFor(r => r.OrderQuery.OrderId).NotEmpty().When(m => string.IsNullOrEmpty(m.OrderQuery.CustomerPo));
                                request.RuleFor(r => r.OrderQuery.LineId).NotEmpty().When(m => string.IsNullOrEmpty(m.OrderQuery.ManufacturerPartNumber));

                                request.RuleFor(r => r.Header.ResellerId).NotEmpty();
                                request.RuleFor(r => r.Header.Hmac).NotEmpty();
                                request.RuleFor(r => r.Header.LastName).NotEmpty();
                                request.RuleFor(r => r.Header.Name).NotEmpty();
                                request.RuleFor(r => r.Header.EcId).NotEmpty();

                                request.RuleFor(r => r.Header).Custom((HeadersList, context) =>
                                {
                                    var buildKey =
                                        $"{HeadersList.ResellerId}{HeadersList.Name}{HeadersList.LastName}{HeadersList.EcId}{_appSettings.GetSetting("NuanceChatBot.Secret")}";
                                    if(!CompareKey(buildKey, HeadersList.Hmac))
                                        context.AddFailure("Custom Key Not same as HMAC");
                                });
                            }));
            }

            private bool CompareKey(string input, string hmac)
            {
                var code = ComputeSha256Hash(input);
                return code.Equals(hmac);
            } 

            private string ComputeSha256Hash(string rawData)
            {   
                using (SHA256 sha256Hash = SHA256.Create())
                {
                    byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));  
                    StringBuilder builder = new StringBuilder();
                    for (int i = 0; i < bytes.Length; i++)
                    {
                        builder.Append(bytes[i].ToString("x2"));
                    }
                    return builder.ToString();
                }
            }
        }
    }
}
