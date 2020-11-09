using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Order.DTO
{
    [ExcludeFromCodeCoverage]
    public class OrderLineDto
    {
        public string LineNumber { get; set; }
        public string MaterialNumber { get; set; }
        public string ManufacturerPartNumber { get; set; }
        public string PartDescription { get; set; }
        public string VendorOrderNumber { get; set; }
        public string VendorPONumber { get; set; }
        public string CustomerPartNumber { get; set; }
        public decimal OrderedQuantity { get; set; }
        public decimal ConfirmedQuantity { get; set; }
        public decimal ShippedQuantity { get; set; }
        public string BackOrdered { get; set; }
        public string Status { get; set; }
        public decimal UnitResale { get; set; }
        public decimal ExtendedResale { get; set; }
        public DateTime RequestedDate { get; set; }
        public DateTime EstimatedShipDate { get; set; }
        public DateTime EstimatedDeliveryDate { get; set; }
        public DateTime ActualShipDate { get; set; }
        public string[] DeliveryDocuments { get; set; }
        public InvoiceDto[] Invoices { get; set; }
        public CarrierTrackingDto[] CarrierTracking { get; set; }
        public string[] SerialNumbers { get; set; }
        public string LicenseKey { get; set; }
        public string PurchaseRequisition { get; set; }
        public string EndUserName { get; set; }
        public string TDPartNumber { get; set; }
        public string ShippingCondition { get; set; }
        public string ShipFrom { get; set; }
        public decimal FEMPercent { get; set; }
        public decimal POMPercent { get; set; }
        public decimal SAMPercent { get; set; }
        public decimal NSMPercent { get; set; }
        public string BPCCD { get; set; }
        public int UniqueApprovalNumber { get; set; }
        public string VendorGlobalMan { get; set; }     //not in core response
        public string VendorLocalMan { get; set; }      //not in core response
        public string ContractNumber { get; set; }
        public string EndUserPONumber { get; set; }         //not in core response
        public SalesOrganizationLevelDto BusinessManager { get; set; }
        public SalesOrganizationLevelDto Director { get; set; }
        public SalesOrganizationLevelDto DivisionManager { get; set; }
        public SalesOrganizationLevelDto SalesArea { get; set; }
        public SalesOrganizationLevelDto SalesExecutiveTeam { get; set; }
        public SalesOrganizationLevelDto SalesSuperArea { get; set; }
        public string BlockStatus { get; set; }
        public string HoldReason { get; set; }
        public string VendorAgreementNumber { get; set; }
        public string VendorSolutionAssociate { get; set; }
        public string VendorSolutionRepresentative { get; set; }
        public OrderLineAgreement[] Agreements { get; set; }

    }
}