//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Export.DocumentGenerators.Interfaces;
using DigitalCommercePlatform.UIServices.Export.Models.Common;
using DigitalCommercePlatform.UIServices.Export.Models.Renewal;
using DigitalCommercePlatform.UIServices.Export.Models.Renewal.Internal;
using DigitalCommercePlatform.UIServices.Export.Models.Renewal.Internal.Product;
using DigitalCommercePlatform.UIServices.Export.Services;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Providers.Settings;
using DigitalFoundation.Common.Services.Layer.UI.Actions.Abstract;
using FluentValidation;
using Flurl;
using MediatR;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Export.Actions.Quote
{

    public sealed class DownloadRenewalQuoteDetails
    {
        public const string mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

        [ExcludeFromCodeCoverage]
        public class Request : IRequest<ResponseBase<Response>>
        {
            public string Id { get; set; }
        }

        [ExcludeFromCodeCoverage]
        public class Response
        {
            public byte[] BinaryContent { get; set; }
            public string MimeType { get; set; }
        }

        [ExcludeFromCodeCoverage]
        public class Handler : IRequestHandler<Request, ResponseBase<Response>>
        {
            private readonly IMiddleTierHttpClient _middleTierHttpClient;
            private readonly IMapper _mapper;
            private readonly ILogger<Handler> _logger;
            private readonly IAppSettings _appSettings;
            private readonly IRenewalService _renewalService;
            private readonly IRenewalQuoteDetailsDocumentGenerator _documentGenerator;

            public Handler(IRenewalService renewalService,
                           IMiddleTierHttpClient middleTierHttpClient,
                           IMapper mapper,
                           IAppSettings appSettings,
                           ILogger<Handler> logger,
                           IRenewalQuoteDetailsDocumentGenerator documentGenerator
                           )
            {
                _renewalService = renewalService;
                _middleTierHttpClient = middleTierHttpClient;
                _mapper = mapper;
                _logger = logger;
                _appSettings = appSettings;
                _documentGenerator = documentGenerator;
            }

            public async Task<ResponseBase<Response>> Handle(Request request, CancellationToken cancellationToken)
            {
                GetRenewalQuoteDetailedRequest getRenewalRequest = new();
                getRenewalRequest.Id = new string[] { request.Id };
                getRenewalRequest.Type = "Renewal";

                List<QuoteDetailedModel> quoteDetailedModels = await _renewalService.GetRenewalsQuoteDetailedFor(getRenewalRequest);

                Response response = new();
                if (quoteDetailedModels?.Count > 0)
                {
                    var model = quoteDetailedModels[0];
                    await GetProduct(model.Items);

                    var binaryContentXls = await _documentGenerator.XlsGenerate(model);
                    DownloadableFile file = new(binaryContentXls, request.Id + ".xls", mimeType);
                    response.BinaryContent = file.BinaryContent;
                    response.MimeType = file.MimeType;
                }

                return new ResponseBase<Response> { Content = response };
            }

            private async Task GetProduct(List<ItemModel> items)
            {
                var url = BuildProductApiURL(items);

                ProductData productDetails = await _middleTierHttpClient.GetAsync<ProductData>(url);
                if (productDetails?.Data == null || productDetails?.Data?.Count() == 0)
                    return;

                foreach (ItemModel item in items)
                {
                    var product = item?.Product.First();
                    if (product == null)
                        break;
                    var productData = productDetails.Data.FirstOrDefault(x => x.Source.ID == product.Id);
                    if (product != null)
                    {
                        product.DisplayName = productData.DisplayName;
                        product.Description = productData.Description;
                        product.Manufacturer = productData.GlobalManufacturer;
                        product.ManufacturerId = productData.ManufacturerPartNumber;
                    }
                }
            }

            private string BuildProductApiURL(List<ItemModel> items)
            {
                StringBuilder sbTDPartNumber = new();
                string _appProductServiceURL = _appSettings.GetSetting("Product.App.Url");

                foreach (var item in items)
                {
                    string id = item.Product?.FirstOrDefault()?.Id;
                    if (!string.IsNullOrWhiteSpace(id))
                        sbTDPartNumber = sbTDPartNumber.Append("&MaterialNumber=" + id);
                }

                _appProductServiceURL = _appProductServiceURL.AppendPathSegment("Find") + "?&Details=False&SalesOrganization=0100&System=2&PageSize=" + items.Count + sbTDPartNumber.ToString();
                return _appProductServiceURL;
            }
        }

        public class Validator : AbstractValidator<Request>
        {
            public Validator()
            {
                RuleFor(x => x.Id).NotEmpty();
            }
        }


    }
}
