//2022 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals.Internal;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals.Internal.Product;
using DigitalFoundation.Common.Features.Client;
using DigitalFoundation.Common.Features.Contexts;
using DigitalFoundation.Common.Providers.Settings;
using Flurl;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Renewal.Services
{
    [ExcludeFromCodeCoverage]
    public class HelperService : IHelperService
    {
        private readonly ILogger<HelperService> _logger;
        private readonly IMiddleTierHttpClient _middleTierHttpClient;
        private readonly IAppSettings _appSettings;
        public HelperService(ILogger<HelperService> logger,
                             IMiddleTierHttpClient middleTierHttpClient,
                             IAppSettings appSettings)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _middleTierHttpClient = middleTierHttpClient;
            _appSettings = appSettings;
        }


        /// <summary>
        ///  Populate lines for order and Quotes
        /// </summary>
        /// <param name="items"></param>
        /// <param name="vendorName"></param>
        /// <returns></returns>
        public async Task<List<ItemModel>> PopulateLinesFor(List<ItemModel> items, string vendorName)
        {
            ProductData productDetails;
            string productUrl = BuildQueryForProductApiCall(items, vendorName);

            try
            {
                productDetails = await _middleTierHttpClient.GetAsync<ProductData>(productUrl);
                ProductsModel product;

                foreach (var line in items)
                {
                    product = productDetails?.Data?.FirstOrDefault(p => p.ManufacturerPartNumber == line.MFRNumber);
                    if (product != null && line != null)
                    {
                        MapLines(product, line);
                    }
                    else
                    {
                        line.ShortDescription = string.Empty;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception at getting product details : " + nameof(RenewalService));
            }

            return items;
        }

        public string GetVendorLogo(string vendorName)
        {
            var vendorLogoUrl = string.Empty;
            try
            {
                var vendorLogos = _appSettings.TryGetSetting<Dictionary<string, string>>("UI.Renewals.VendorLogos");
                if (vendorLogos.ContainsKey(vendorName))
                {
                    vendorLogoUrl = vendorLogos[vendorName];
                }
            }
            catch(Exception ex)
            {
                _logger.LogWarning(ex, "Error Getting VendorLogo for `{VendorName}`", vendorName);
            }
            return vendorLogoUrl;
        }

        /// <summary>
        /// returns Application product API call URL
        /// </summary>
        /// <param name="items"></param>
        /// <param name="vendorName"></param>
        /// <returns></returns>
        private string BuildQueryForProductApiCall(List<ItemModel> items, string vendorName)
        {
            string _appProductServiceURL = string.Empty;
            try
            {
                _appProductServiceURL = _appSettings.GetSetting("App.Product.Url");
            }
            catch (Exception)
            {
                _appProductServiceURL = _appSettings.GetSetting("Product.App.Url");
            }

            string manufacturer = "";
            string system = vendorName;            
            string productId;

            // use string builder as flur is encoding "=" in Manufacturer Part Number resulting in wrong response
            StringBuilder sbManufacturer = new();
            StringBuilder sbVendorPart = new();


            int i = 0;
            foreach (var item in items)
            {
                if (!string.IsNullOrWhiteSpace(item?.MFRNumber))
                {
                    productId = item.MFRNumber;
                }
                else
                {
                    productId = "";
                }
                item.VendorPartNo = productId;
                item.Manufacturer = item.Manufacturer ?? system;
                manufacturer = item.Manufacturer ?? system;
                i++;

                BuildQueryString(productId, ref sbManufacturer, ref sbVendorPart, item);
            }
            // Pass Details=True as paramere next push
            var url = _appProductServiceURL.AppendPathSegment("Find") + "?&Details=False&SalesOrganization=0100&PageSize=" + i + sbVendorPart.ToString() + sbManufacturer.ToString();
            return url;
        }

        private static void BuildQueryString(string productId, ref StringBuilder sbManufacturer, ref StringBuilder sbVendorPart, ItemModel item)
        {
            if (!string.IsNullOrWhiteSpace(productId))
            {
                if (!sbManufacturer.ToString().Contains(item.Manufacturer))
                {
                    sbManufacturer = sbManufacturer.Append("&Manufacturer=" + item.Manufacturer);
                }
                if (!sbVendorPart.ToString().Contains(productId))
                {
                    sbVendorPart = sbVendorPart.Append("&MfrPartNumber=" + productId);
                }
            }
        }

        /// <summary>
        /// Map Order / Quote Lines 
        /// </summary>
        /// <param name="product"></param>
        /// <param name="line"></param>
        private static void MapLines(ProductsModel product, ItemModel line)
        {
            line.ShortDescription = string.IsNullOrWhiteSpace(product.ShortDescription) ? line.ShortDescription : product.ShortDescription;
            line.TDNumber = product?.Source.Id;
            line.MFRNumber = product?.ManufacturerPartNumber;
        }

    }
}
