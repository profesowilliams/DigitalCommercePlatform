using DigitalFoundation.App.Services.Quote.DTO.Internal;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.App.Services.Quote.DTO
{
    [ExcludeFromCodeCoverage]
    public class SummaryDto
    {
        public SourceDto Source { get; set; }
        public decimal Revision { get; set; }
        public decimal SubRevision { get; set; }
        public string Description { get; set; }
        public string ActiveFlag { get; set; }
        public string Request { get; set; }
        public string EndUserPO { get; set; }
        public string CustomerPO { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; }
        public string DocumentType { get; set; }
        public string QuoteType { get; set; }
        public TypeDto Type { get; set; }
        public LevelDto Level { get; set; }
        public string Creator { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        public DateTime Expiry { get; set; }
        public string Status { get; set; }
        public string StatusNotes { get; set; }
        public ResellerDto Reseller { get; set; }
        public EndUserDto EndUser { get; set; }
        public List<OrderDto> Orders { get; set; }
        public List<VendorReferenceDto> VendorReference { get; set; }
        public Models.Quote.Internal.SalesTeamModel SalesTeam { get; set; }
        public Models.Quote.Internal.SalesAreaModel SalesArea { get; set; }
        public Models.Quote.Internal.SuperSalesAreaModel SuperSalesArea { get; set; }
        public Models.Quote.Internal.LastUpdatedBy LastUpdatedBy { get; set; }
    }
}