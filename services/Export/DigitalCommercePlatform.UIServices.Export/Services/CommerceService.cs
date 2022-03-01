//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using DigitalCommercePlatform.UIServices.Export.Models.Quote;
using DigitalCommercePlatform.UIServices.Export.Models.UIServices.Commerce;
using DigitalFoundation.Common.Extensions;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
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
        private readonly IUIContext _uiContext;
        private readonly IAppSettings _appSettings;
        private readonly IMapper _mapper;

        public CommerceService(IMiddleTierHttpClient middleTierHttpClient,
            ILogger<CommerceService> logger,
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

        public async Task<QuoteDetails> GetQuote(GetQuote.Request request)
        {
            string URL = _appSettings.GetSetting("UI.Commerce.Url");
            URL= URL.AppendPathSegment("/quote/details").BuildQuery(request);

            IDictionary<string, string> headersFromRequest = new Dictionary<string, string>();
            headersFromRequest.Add("SessionId", request.SessionId);
            var getUIQuoteResponse = await _middleTierHttpClient.GetAsync<ResponseBase<Response<QuoteDetails>>>(URL, null, null, headersFromRequest);
            return getUIQuoteResponse?.Content.Details;
        }

        public async Task<Models.Order.Internal.OrderModel> GetOrderByIdAsync(string id)
        {
            _appOrderServiceUrl = _appSettings.GetSetting("App.Order.Url");
            var url = _appOrderServiceUrl.SetQueryParams(new { id });
            var getOrderByIdResponse = await _middleTierHttpClient.GetAsync<List<Models.Order.Internal.OrderModel>>(url);
            OrderModel result = FilterOrderLines(getOrderByIdResponse?.FirstOrDefault());
            result = PopulateOrderDetails(getOrderByIdResponse?.FirstOrDefault());
            return result;
        }

        private Models.Order.Internal.OrderModel PopulateOrderDetails(Models.Order.Internal.OrderModel order)
        {
            order.Tax = order.Items.Where(t => t.Tax.HasValue).Sum(t => t.Tax.Value);
            order.Freight = order.Items.Where(t => t.Freight.HasValue).Sum(t => t.Freight.Value);
            order.OtherFees = order.Items.Where(t => t.OtherFees.HasValue).Sum(t => t.OtherFees.Value);
            order.SubTotal = order.Price == null ? 0 : order.Price;
            decimal? subtotal = order.SubTotal == null ? 0 : order.SubTotal;
            decimal? Other = order.OtherFees == null ? 0 : order.OtherFees;
            decimal? Freight = order.Freight == null ? 0 : order.Freight;
            decimal? Tax = +order.Tax == null ? 0 : order.Tax;

            order.Total = subtotal + Other + Freight + Tax;

            return order;
        }
        public Models.Order.Internal.OrderModel FilterOrderLines(Models.Order.Internal.OrderModel orderDetail)
        {
            if (orderDetail.Source?.System == "3") // for 6.8 orders return all lines
                return orderDetail;
            else
            {
                orderDetail = FilterOrderKitLines(orderDetail);
                orderDetail = FilterOrderGATPLines(orderDetail);
            }
            return orderDetail;
        }

        private OrderModel FilterOrderGATPLines(OrderModel orderDetail)
        {
            var parents = orderDetail.Items.Where(i => i.Parent == "0" || i.Parent == null).ToList().OrderBy(o => o.ID);

            Parallel.ForEach(parents,
                new ParallelOptions { MaxDegreeOfParallelism = 3 }, line =>
                {
                    if (line.POSType?.ToUpper() == "AH")
                    {
                        var subLines = orderDetail.Items.Where(i => (i.Parent == line.ID && i.POSType?.ToUpper() == "AI"))?.ToList();
                        if (subLines.Count == 1)
                        {
                            MovePaymentInformation(line, subLines);
                            MapShipments(line, subLines);
                            MapSerials(line, subLines);
                            MapInvoices(line, subLines);
                            // remove AI line 
                            orderDetail.Items.Remove(subLines.FirstOrDefault());
                        }
                        else
                        {
                            line.Freight = 0.00M;
                            line.OtherFees = 0.00M;
                            line.Tax = 0.00M;
                        }
                    }

                });
            return orderDetail;
        }

        private void MovePaymentInformation(Item line, List<Item> subLines)
        {

            line.Freight = subLines.FirstOrDefault()?.Freight ?? 0.00M;
            line.OtherFees = subLines.FirstOrDefault()?.OtherFees ?? 0.00M;
            line.Tax = subLines.FirstOrDefault()?.Tax ?? 0.00M;

        }
        private void MapSerials(Item line, List<Item> subLines)
        {

            var serials = new List<string>();
            if (line.Serials != null && line.Serials?.Count > 0)
                serials = line.Serials;

            if (subLines?.FirstOrDefault()?.Serials != null && subLines?.FirstOrDefault()?.Serials?.Count > 0)
                serials.AddRange(subLines?.FirstOrDefault()?.Serials.Except(serials)); // avoid duplicates while adding serial number

            line.Serials = serials;

        }

        private void MapShipments(Item line, List<Item> subLines)
        {
            var shipments = new List<ShipmentModel>();

            if (line.Shipments != null && line.Shipments?.Count > 0)
                shipments = line.Shipments;

            if (subLines?.FirstOrDefault()?.Shipments != null && subLines?.FirstOrDefault()?.Shipments?.Count > 0)
            {
                foreach (var shipment in subLines.FirstOrDefault().Shipments)
                {
                    if ((!string.IsNullOrWhiteSpace(shipment.TrackingNumber) && shipments.Where(x => x.TrackingNumber == shipment.TrackingNumber).Count() == 0))
                        shipments.Add(shipment);
                }
            }

            line.Shipments = shipments;
        }

        private void MapInvoices(Item line, List<Item> subLines)
        {
            var invoices = new List<InvoiceModel>();

            if (line.Invoices != null && line.Invoices?.Count > 0)
                invoices = line.Invoices;

            if (subLines?.FirstOrDefault()?.Invoices != null && subLines?.FirstOrDefault()?.Invoices?.Count > 0)
            {

                foreach (var invoice in subLines?.FirstOrDefault()?.Invoices)
                {
                    if (invoices.Where(x => x.ID == invoice.ID).Count() == 0)
                        invoices.Add(invoice);
                }
            }

            line.Invoices = invoices;
        }
        private Models.Order.Internal.OrderModel FilterOrderKitLines(Models.Order.Internal.OrderModel orderDetail)
        {
            orderDetail.Items = orderDetail.Items.Where(i => i.POSType?.ToUpper() != "KC").ToList();
            return orderDetail;
        }
    }
}