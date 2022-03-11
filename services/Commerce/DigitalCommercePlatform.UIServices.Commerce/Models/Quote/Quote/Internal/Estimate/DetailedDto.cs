//2021 (c) Tech Data Corporation -. All Rights Reserved.
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Quote.Quote.Internal.Estimate
{
    [ExcludeFromCodeCoverage]
    public class DetailedDto
    {
        public SourceDto Source { get; set; }
        public string Description { get; set; }
        public string Name { get; set; }
        public DateTime? Created { get; set; }
        public DateTime? Updated { get; set; }
        public DateTime? Published { get; set; }
        public string BatchId { get; set; }
        public string SalesOrg { get; set; }
        public string DistiBuyMethod { get; set; }
        public string Region { get; set; }
        public string ProgramName { get; set; }
        public string ResellerPo { get; set; }
        public string EndUserPo { get; set; }
        public string LastEndUserPo { get; set; }
        public string EndUserType { get; set; }
        public string EANumber { get; set; }
        public string LastResellerPo { get; set; }
        public IEnumerable<AdditionalIdentifierDto> AdditionalIdentifiers { get; set; }
        public string PriceListId { get; set; }
        public string Status { get; set; }
        public string StatusText { get; set; }
        public DateTime? NetPriceProtectionDate { get; set; }
        public string VendorStatus { get; set; }
        public DateTime? ExpiryDate { get; set; }
        public string Sequence { get; set; }
        public string RenewalGroupId { get; set; }
        public string Incumbent { get; set; }
        public string VendorIncumbent { get; set; }
        public decimal TotalListPrice { get; set; }
        public decimal TotalCost { get; set; }
        public ResellerDto Reseller { get; set; }
        public EndUserDto EndUser { get; set; }
        public VendorDto Vendor { get; set; }
        public BillToDto BillTo { get; set; }
        public CreatedByDto CreatedBy { get; set; }
        public OwnerDto Owner { get; set; }
        public RenewalInRuleDto Renewal { get; set; }
        public IEnumerable<ItemDto> Items { get; set; }
        public string RenewedDuration { get; set; }
        public DateTime? DueDate { get; set; }
        public string Currency { get; set; } = "USD";
        public string ConfigID { get; set; }
        public string BuyMethod { get; set; }
        public ShipToDto ShipTo { get; set; }
        public List<QuoteDto> Quotes { get; set; }
        public bool? IsFederalQuote { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class SourceDto
    {
        public string Id { get; set; }
        public string System { get; set; }
        public string Type { get; set; }
    }

    [ExcludeFromCodeCoverage]
    [JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
    public class BillToDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public ContactDto Contact { get; set; }
        public AddressDto Address { get; set; }
    }

    [ExcludeFromCodeCoverage]
    [JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
    public class CreatedByDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string EmailAddress { get; set; }
    }

    [ExcludeFromCodeCoverage]
    [JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
    public class OwnerDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public AddressDto Address { get; set; }
        public string EmailAddress { get; set; }
    }

    [JsonObject(NamingStrategyType = typeof(CamelCaseNamingStrategy))]
    public class RenewalInRuleDto
    {
        public decimal? Total { get; set; }
        public string Currency { get; set; }
        public decimal? Save { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class ShipToDto
    {
        public string CustomerName { get; set; }
        public ContactDto Contact { get; set; }
        public AddressDto Address { get; set; }
    }

    [ExcludeFromCodeCoverage]
    public class QuoteDto
    {
        public string Id { get; set; }
        public string SalesOrg { get; set; }
        public string System { get; set; }
    }
}
