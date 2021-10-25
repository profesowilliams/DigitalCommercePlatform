//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.Models.Quote;
using DigitalCommercePlatform.UIServices.Export.Models.UIServices.Commerce;
using DigitalFoundation.Common.Client;
using DigitalFoundation.Common.Contexts;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.Services
{
    [ExcludeFromCodeCoverage]
    public class CommerceService : ICommerceService
    {
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private string _appOrderServiceUrl;
        private readonly ILogger<CommerceService> _logger;
        private readonly IExportService _helperService;
        private readonly IUIContext _uiContext;
        private readonly IAppSettings _appSettings;
        private string _appQuoteServiceUrl;
        private readonly IMapper _mapper;

        public CommerceService(IMiddleTierHttpClient middleTierHttpClient,
            ILogger<CommerceService> logger,
            IAppSettings appSettings,
            IUIContext uiContext,
            IMapper mapper,
            IExportService helperService)
        {
            _middleTierHttpClient = middleTierHttpClient ?? throw new ArgumentNullException(nameof(middleTierHttpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _helperService = helperService;
            _uiContext = uiContext;
            _mapper = mapper ?? throw new ArgumentNullException(nameof(mapper));
            _appSettings = appSettings;
        }

        public async Task<QuoteModel> GetQuote(GetQuote.Request request)
        {
            _appQuoteServiceUrl = _appSettings.GetSetting("App.Quote.Url");
            var quoteURL = _appQuoteServiceUrl.BuildQuery(request);

            var getQuoteResponse = await _middleTierHttpClient.GetAsync<IEnumerable<QuoteModel>>(quoteURL);
            return getQuoteResponse?.FirstOrDefault();
        }

        public async Task<Models.Order.Internal.OrderModel> GetOrderByIdAsync(string id)
        {
            _appOrderServiceUrl = _appSettings.GetSetting("App.Order.Url");
            var url = _appOrderServiceUrl.SetQueryParams(new { id });
            var getOrderByIdResponse = await _middleTierHttpClient.GetAsync<List<Models.Order.Internal.OrderModel>>(url);
            Models.Order.Internal.OrderModel result = PopulateOrderDetails(getOrderByIdResponse?.FirstOrDefault());
            return result;
        }

        private Models.Order.Internal.OrderModel PopulateOrderDetails(Models.Order.Internal.OrderModel order)
        {
            order.Tax = order.Items.Where(t => t.Tax.HasValue).Sum(t => t.Tax.Value);
            order.Freight = order.Items.Where(t => t.Freight.HasValue).Sum(t => t.Freight.Value);
            order.OtherFees = order.Items.Where(t => t.OtherFees.HasValue).Sum(t => t.OtherFees.Value);
            order.SubTotal = order.TotalCharge == null ? 0 : order.TotalCharge;
            decimal? subtotal = order.SubTotal == null ? 0 : order.SubTotal;
            decimal? Other = order.OtherFees == null ? 0 : order.OtherFees;
            decimal? Freight = order.Freight == null ? 0 : order.Freight;
            decimal? Tax = +order.Tax == null ? 0 : order.Tax;

            order.Total = subtotal + Other + Freight + Tax;
            return order;
        }

    }
}