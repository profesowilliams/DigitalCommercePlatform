//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.SPA
{
    [ExcludeFromCodeCoverage]
    public class SpaFindModel
    {
        public string Id { get; set; }
        public bool Details { get; set; }

        public SpaFindModel(string id, bool details)
        {
            Id = id;
            Details = details;
        }
    }

    [ExcludeFromCodeCoverage]
    public class SPAProduct
    {
        public string ManufacturerPartNo { get; set; }
        public string TDPartNo { get; set; }
        public decimal? Quantity { get; set; }
        public decimal UnitListPrice { get; set; }
        
    }
}
