//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models.Internal;
using DigitalCommercePlatform.UIServices.Export.Models.Common;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models
{
    [ExcludeFromCodeCoverage]
    public class QuoteModel
    {
        public DateTime Published { get; set; }
        public SourceModel Source { get; set; }
        public decimal Revision { get; set; }
        public decimal SubRevision { get; set; }
        public string Description { get; set; }
        public string ActiveFlag { get; set; }
        public string Request { get; set; }
        public string EndUserPO { get; set; }
        public string CustomerPO { get; set; }
        public decimal Price { get; set; }
        public string PriceFormatted { get { return string.Format(Constants.MoneyFormat, Price); } }
        public string Currency { get; set; }
        public string CurrencySymbol { get; set; } = "$";
        public string DocumentType { get; set; }
        public TypeModel Type { get; set; }
        public LevelModel Level { get; set; }
        public string Creator { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        public DateTime Expiry { get; set; }
        public string Status { get; set; }
        public string StatusNotes { get; set; }
        public ResellerModel Reseller { get; set; }
        public ShipToModel ShipTo { get; set; }
        public EndUserModel EndUser { get; set; }
        public VendorSalesRepModel VendorSalesRep { get; set; }
        public VendorSalesAssociateModel VendorSalesAssociate { get; set; }
        public SalesTeamModel SalesTeam { get; set; }
        public SalesAreaModel SalesArea { get; set; }
        public SuperSalesAreaModel SuperSalesArea { get; set; }
        public LastUpdatedBy LastUpdatedBy { get; set; }
        public List<OrderModel> Orders { get; set; }
        public List<VendorReferenceModel> VendorReference { get; set; }
        public List<ItemModel> Items { get; set; }
        public List<AgreementModel> Agreements { get; set; }
    }
}
