using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Common.Configuration.Models.Configurations.Internal
{
    [ExcludeFromCodeCoverage]
    public class SummaryDto
    {
        public SourceDto Source { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Updated { get; set; }
        public DateTime? Published { get; set; }
        public string BatchId { get; set; }
        public string SalesOrg { get; set; }
        public string ProgramName { get; set; }
        public string ResellerPo { get; set; }
        public string LastResellerPo { get; set; }
        public string EndUserPo { get; set; }
        public string LastEndUserPo { get; set; }
        public string EndUserType { get; set; }
        public string EANumber { get; set; }
        public List<AdditionalIdentifierDto> AdditionalIdentifiers { get; set; }
        public string PriceListId { get; set; }
        public DateTime? NetPriceProtectionDate { get; set; }
        public string Status { get; set; }
        public string StatusText { get; set; }
        public string VendorStatus { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string Sequence { get; set; }
        public string RenewalGroupId { get; set; }
        public string Incumbent { get; set; }
        public string VendorIncumbent { get; set; }
        public decimal? TotalListPrice { get; set; }
        public decimal? TotalCost { get; set; }
        public ResellerDto Reseller { get; set; }
        public EndUserDto EndUser { get; set; }
        public VendorDto Vendor { get; set; }
        public CreatedByDto CreatedBy { get; set; }
        public OwnerDto Owner { get; set; }
    }
}
