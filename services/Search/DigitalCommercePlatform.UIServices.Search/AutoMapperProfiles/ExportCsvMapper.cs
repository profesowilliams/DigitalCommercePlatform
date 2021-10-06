//2021 (c) Tech Data Corporation -. All Rights Reserved.

using CsvHelper.Configuration;
using DigitalCommercePlatform.UIServices.Search.Models.FullSearch;

namespace DigitalCommercePlatform.UIServices.Search.AutoMapperProfiles
{
    public sealed class ExportCsvMapper : ClassMap<ExportResponseModel>
    {
        public ExportCsvMapper()
        {
            Map(m => m.ManufacturerName)
                 .Index(0)
                 .Name("Manufacturer Name");

            Map(m => m.ManufacturerPartNumber)
                .Index(1)
                .Name("Manufacturer Part Number");

            Map(m => m.Id)
                .Index(2)
                .Name("Part Number");

            Map(m => m.TotalStock)
                .Index(3)
                .Name("Quantity Available");

            Map(m => m.ProductStatus)
                .Index(4)
                .Name("Product Status");

            Map(m => m.Description)
                .Index(5)
                .Name("Description");

            Map(m => m.UpcNumber)
                .Index(6)
                .Name("Upc Number");

            Map(m => m.PromoIndicator)
                .Index(7)
                .Name("Promo");

            Map(m => m.BestPrice)
                .Index(8)
                .Name("Unit Price");

            Map(m => m.ListPrice)
                .Index(9)
                .Name("MSRP Price");

            Map(m => m.BestPriceExpiration)
                .Index(10)
                .Name("Promo Valid Until");

            Map(m => m.MaximumResults).Ignore();
        }
    }
}