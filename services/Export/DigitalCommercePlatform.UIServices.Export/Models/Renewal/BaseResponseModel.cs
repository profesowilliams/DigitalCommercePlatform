//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models.Renewal.Internal;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models.Renewal
{
    [ExcludeFromCodeCoverage]
    public class BaseResponseModel : IBaseResponseModel
    {
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
        public ValueModel Type { get; set; }
        public ValueModel Level { get; set; }
        public string Creator { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        public DateTime Expiry { get; set; }
        public string Status { get; set; }
        public string StatusNotes { get; set; }
        public NameModel AccountOwner { get; set; }
        public List<OrderModel> Orders { get; set; }
        public List<ValueModel> VendorReference { get; set; }
        public SalesTeamModel SalesTeam { get; set; }
        public SalesTeamModel SalesArea { get; set; }
        public SalesTeamModel SuperSalesArea { get; set; }
        public NameModel LastUpdatedBy { get; set; }
        public decimal FEMAmount { get; set; }
        public decimal POMAmount { get; set; }
        public decimal SAMAmount { get; set; }
        public decimal NSMAmount { get; set; }
        public decimal FEMPercentage { get; set; }
        public decimal POMPercentage { get; set; }
        public decimal SAMPercentage { get; set; }
        public decimal NSMPercentage { get; set; }
    }
}