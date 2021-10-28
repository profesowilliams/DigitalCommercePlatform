//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Actions.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Settings;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewal.Services
{
    public class RenewalService : IRenewalService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly ILogger<RenewalService> _logger;
        private readonly IUIContext _uiContext;
        private readonly IAppSettings _appSettings;
        private readonly IMapper _mapper;
        private string _appRenewalServiceUrl;
        private string _appQuoteServiceUrl;

        public RenewalService(IMiddleTierHttpClient middleTierHttpClient,
            ILogger<RenewalService> logger,
            IAppSettings appSettings,
            IUIContext uiContext,
            IMapper mapper)
        {
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _uiContext = uiContext;
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _appSettings = appSettings;
        }
        public async Task<List<RenewalsModel>> GetRenewalsFor(GetRenewal.Request request)
        {
            _appRenewalServiceUrl = _appSettings.GetSetting("App.Renewal.Url");
            _appQuoteServiceUrl = _appSettings.GetSetting("App.Quote.Url");
            //var url = _appRenewalServiceUrl.SetQueryParams(new { id });
            // var renewals = await _middleTierHttpClient.GetAsync<List<ResponseFromAppRenewalsModel>>(url);
            // write Mapper
            //return dummy data 
            var lstRenewals = new List<RenewalsModel>();
            
            for (int i = 0; i < 5; i++)
            {
                var objRenewalsModel = new RenewalsModel
                {
                    Id = i
                };
                lstRenewals.Add(objRenewalsModel);
            }
            
            return await Task.FromResult(lstRenewals);
        }
    }
}
