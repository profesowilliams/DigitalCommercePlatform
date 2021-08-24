//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Models.Deals
{
    [ExcludeFromCodeCoverage]
    public class MaterialInformation
    {
        public string TDPartNumber { get; set; }
        public string VendorPartNumber { get; set; }
        public string Description { get; set; }
        public string MinimumQuantity { get; set; }
        public int MaximumQuantity { get; set; }
        public string UsedQuantity { get; set; }
        public int RemainingQuantity { get; set; }
        public string AllowanceType { get; set; }
        public string Allowance { get; set; }
        public int MaximumQuantityPerCustomer { get; set; }
        public bool HasErrors { get; set; }
    }
}
