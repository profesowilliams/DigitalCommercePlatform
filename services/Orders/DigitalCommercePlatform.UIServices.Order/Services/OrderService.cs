//2021 (c) Tech Data Corporation - All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using DigitalCommercePlatform.UIServices.Order.Actions.NuanceChat;
using DigitalCommercePlatform.UIServices.Order.Dto;
using DigitalCommercePlatform.UIServices.Order.Dto.Order;
using DigitalCommercePlatform.UIServices.Order.Models.Order;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Logging;

namespace DigitalCommercePlatform.UIServices.Order.Services
{
    public class OrderService:IOrderService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<OrderService> _logger;
        private readonly IMapper _mapper;
        private readonly string _appOrderServiceUrl;

        public OrderService(IMiddleTierHttpClient middleTierHttpClient,
            ILogger<OrderService> logger, IAppSettings appSettings,
            IMapper mapper)
        {
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _appOrderServiceUrl = appSettings.GetSetting("App.Order.Url");
        }
        public async Task<OrderModel> GetOrders(NuanceWebChatRequest request)
        {
            try
            {
                _logger.LogInformation("Call Order");
                var finfRequest = _mapper.Map<FindRequestModel>(request);
                var coreResult = await
                    _middleTierHttpClient.GetAsync<ResponseDto>(_appOrderServiceUrl.AppendPathSegment("Find").BuildQuery(finfRequest)).ConfigureAwait(false);
                var modelList = _mapper.Map<List<OrderModel>>(coreResult.Data);
                return modelList.FirstOrDefault();
            }
            catch(Exception ex)
            {
                _logger.LogError(ex.Message);
                throw;
            }
            
        }
    }
}
