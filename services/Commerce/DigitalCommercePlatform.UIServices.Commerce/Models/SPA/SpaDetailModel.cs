//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
namespace DigitalCommercePlatform.UIServices.Commerce.Models.SPA
{
    [ExcludeFromCodeCoverage]
    public class SpaDetailModel : SpaBaseModel, ISpaProductsList
    {
        public IList<string> PricingLevels { get; set; }
        public IList<SpaProductModel> Products { get; set; }
        public IList<SpaProductDefinition> ProductInclusions { get; set; }
        public IList<SpaProductDefinition> ProductExclusions { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public abstract class SpaBaseModel
    {
        public SpaSourceModel Source { get; set; }
        public string AccountManager { get; set; }
        public string VendorBidNumber { get; set; }
        public string Description { get; set; }
        public string Vendor { get; set; }
        public string VendorName { get; set; }
        public string EndUser { get; set; }
        public string EndUserName { get; set; }
        public DateTime? ExpirationDate { get; set; }
    }

    public interface ISpaProductsList
    {
        IList<SpaProductModel> Products { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class SpaProductModel
    {
        public SimpleSourceModel Source { get; set; }
        public string Name { get; set; }
        public string[] SalesOrganizations { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public string ShortDescription { get; set; }
        public int MinimumQuantity { get; set; }
        public int MaximumQuantity { get; set; }
        public string AllowanceType { get; set; }
        public decimal AllowanceAmount { get; set; }
        public int CustomerMaximumQuantity { get; set; }
        public int RemainingQuantity { get; set; }
    }


    [ExcludeFromCodeCoverage]
    public class SpaProductDefinition
    {
        public string Id { get; set; }
        public string Type { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class SimpleSourceModel
    {
        public string Id { get; set; }
        public string system { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class SpaSourceModel
    {
        public string Id { get; set; }
        public decimal Version { get; set; }
        public string System { get; set; }
    }

}
