using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.SPA
{
    [ExcludeFromCodeCoverage]
    public class SpaBase
    {
        public IList<SpaDetailProductModel> Products { get; set; }
        public SpaSourceModel Source { get; set; }
        public string AccountManager { get; set; }
        public string VendorBidNumber { get; set; }
        public string Description { get; set; }
        public string Vendor { get; set; }
        public string VendorName { get; set; }
        public string EndUser { get; set; }
        public string EndUserName { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public List<QuoteDetails> Quotes { get; set; }
    }
    public class SpaSourceModel
    {
        public string Id { get; set; }
        public decimal Version { get; set; }
        public string System { get; set; }
    }

    public class SpaDetailProductModel : SpaProductBase
    {
        public string Name { get; set; }
        public string[] SalesOrganizations { get; set; }
        public string ManufacturerPartNumber { get; set; }
    }

    public abstract class SpaProductBase
    {
        public SimpleSourceModel Source { get; set; }
        public int MinimumQuantity { get; set; }
        public int MaximumQuantity { get; set; }
        public string AllowanceType { get; set; }
        public decimal AllowanceAmount { get; set; }
        public int CustomerMaximumQuantity { get; set; }
        public int RemainingQuantity { get; set; }
    }
    public class SimpleSourceModel
    {
        public string Id { get; set; }
        public string System { get; set; }
    }

    public class QuoteDetails
    {
        public string ID { get; set; }
        public string Line { get; set; }
        public int? Quantity { get; set; }
        public decimal? Price { get; set; }
        public DateTime? Created { get; set; }
    }
}
