using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Models.TDOSSalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class OrderLineModel
    {
        public string LineNumber { get; set; }
        public string MaterialNumber { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public string PartDescription { get; set; }
        public string VendorOrderNumber { get; set; }
        public string VendorPONumber { get; set; }
        public string CustomerPartNumber { get; set; }
        public int OrderedQuantity { get; set; }
        public int ConfirmedQuantity { get; set; }
        public int ShippedQuantity { get; set; }
        public string BackOrdered { get; set; }
        public string Status { get; set; }
        public decimal UnitResale { get; set; }
        public decimal ExtendedResale { get; set; }
        public DateTime? RequestedDate { get; set; }
        public DateTime? EstimatedShipDate { get; set; }
        public DateTime? EstimatedDeliveryDate { get; set; }
        public DateTime? ActualShipDate { get; set; }
        public string[] DeliveryDocuments { get; set; }
        public InvoiceModel[] Invoices { get; set; }
        public CarrierTrackingModel[] CarrierTracking { get; set; }
        public string[] SerialNumbers { get; set; }
        public string LicenseKey { get; set; }
        public string PurchaseRequisition { get; set; }
        public string EndUserName { get; set; }
        public string TDPartNumber { get; set; }
        public string ShippingCondition { get; set; }
        public string ShippingDescription { get; set; }
        public string ShippingType { get; set; }
        public string ShipFrom { get; set; }
        public decimal FEMPercent { get; set; }
        public decimal POMPercent { get; set; }
        public decimal SAMPercent { get; set; }
        public decimal NSMPercent { get; set; }
        public string BPCCD { get; set; }
        public IEnumerable<string> UniqueApprovalNumber { get; set; }
        public string VendorGlobalMan { get; set; }     //not in core response
        public string VendorLocalMan { get; set; }      //not in core response
        public string ContractNumber { get; set; }
        public string EndUserPONumber { get; set; }         //not in core response
        public SalesOrganizationLevelModel BusinessManager { get; set; }
        public SalesOrganizationLevelModel Director { get; set; }
        public SalesOrganizationLevelModel DivisionManager { get; set; }
        public SalesOrganizationLevelModel SalesArea { get; set; }
        public SalesOrganizationLevelModel SalesExecutiveTeam { get; set; }
        public SalesOrganizationLevelModel SalesSuperArea { get; set; }
        public string BlockStatus { get; set; }
        public string HoldReason { get; set; }
        public string VendorAgreementNumber { get; set; }
        public OrderLineAgreementModel[] Agreements { get; set; }
    }
}