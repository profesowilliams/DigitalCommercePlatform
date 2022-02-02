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
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Providers.Settings;
using Flurl;
using Microsoft.Extensions.Logging;

namespace DigitalCommercePlatform.UIServices.Order.Services
{
    public class OrderService : IOrderService
    {
        private readonly IDigitalFoundationClient _dfHttpClient;
        private readonly ILogger<OrderService> _logger;
        private readonly IMapper _mapper;
        private readonly string _appOrderServiceUrl;

        public OrderService(IDigitalFoundationClient dfHttpClient,
            ILogger<OrderService> logger, IAppSettings appSettings,
            IMapper mapper)
        {
            _dfHttpClient = dfHttpClient ?? throw new ArgumentNullException(nameof(dfHttpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _appOrderServiceUrl = appSettings.GetSetting("App.Order.Url");
        }
        public async Task<OrderModel> GetOrders(NuanceWebChatRequest request)
        {
            try
            {
                _logger.LogInformation("Call Order");
                var findRequest = _mapper.Map<FindRequestModel>(request);
                findRequest.TDOSSearchable = true;
                var coreResult = await
                    _dfHttpClient.GetAsync<ResponseDto>(_appOrderServiceUrl.AppendPathSegment("Find").BuildQuery(findRequest), request.Header.EcId).ConfigureAwait(false);
                var filteredResult = new List<OrderDto>();
                foreach (var r in coreResult?.Data)
                {
                    if ((r.Source?.System == "2" || r.Source?.System == "3") && r.Items?.Count > 0)
                        r.Items.RemoveAll(x => !x.TDOSSearchable);
                    if (r.Items?.Count > 0) filteredResult.Add(r);
                }
                var modelList = _mapper.Map<List<OrderModel>>(filteredResult);
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
