//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System;

namespace DigitalCommercePlatform.UIServices.Search.Models.FullSearch
{
    public class ExportResponseModel
    {
        public string ManufacturerName { get; set; }

        public string ManufacturerPartNumber { get; set; }

        public string Id { get; set; }

        public string UpcNumber { get; set; }

        public int TotalStock { get; set; }

        public string ProductStatus { get; set; }

        public string Description { get; set; }

        public decimal? ListPrice { get; set; }

        public decimal? BestPrice { get; set; }

        public DateTime? BestPriceExpiration { get; set; }

        public string PromoIndicator { get; set; }

        public bool MaximumResults { get; set; }
    }
}