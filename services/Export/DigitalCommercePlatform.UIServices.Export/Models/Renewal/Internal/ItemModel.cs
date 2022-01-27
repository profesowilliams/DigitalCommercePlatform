//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Export.Models.Renewal.Internal
{
    [ExcludeFromCodeCoverage]
    public class ItemModel
    {
        public string ID { get; set; }
        public string Group { get; set; }
        public string Solution { get; set; }
        public string Parent { get; set; }
        public List<ProductModel> Product { get; set; }
        public decimal Quantity { get; set; }
        public decimal ConfirmedQuantity { get; set; }
        public string ContractNumber { get; set; }
        public string ContractType { get; set; }
        public string License { get; set; }
        public List<QuoteTypeValueModel> References { get; set; }
        public string Status { get; set; }
        public string StatusNotes { get; set; }
        public DateTime Updated { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal UnitCost { get; set; }
        public decimal TotalPrice { get; set; }
        public decimal UnitListPrice { get; set; }
        public string UnitPriceCurrency { get; set; }
        public string UnitCostCurrency { get; set; }
        public string UnitListPriceCurrency { get; set; }
        public decimal ExtendedListPrice { get; set; }
        public DateTime Requested { get; set; }
        public string ShippingCondition { get; set; }
        public string ShippingFrom { get; set; }
        public NameModel BusinessManager { get; set; }
        public NameModel DivisionManager { get; set; }
        public NameModel Director { get; set; }
        public string RejectionCode { get; set; }
        public string RejectionDescription { get; set; }
        public decimal FEMAmount { get; set; }
        public decimal POMAmount { get; set; }
        public decimal SAMAmount { get; set; }
        public decimal NSMAmount { get; set; }
        public decimal FEMPercentage { get; set; }
        public decimal POMPercentage { get; set; }
        public decimal SAMPercentage { get; set; }
        public decimal NSMPercentage { get; set; }
        public List<QuoteAgreementModel> Agreements { get; set; }
        public List<AttributeModel> Attributes { get; set; }
        public string DealRegNumber { get; set; }
        public decimal? ReinstatementFeeCost { get; set; }
        public decimal? ReinstatementFeeSell { get; set; }
        public List<string> SerialNumbers { get; set; }
        public string Instance { get; set; }
        public List<QuoteTypeValueModel> Discounts { get; set; }
        public ContractModel Contract { get; set; }
    }
}
