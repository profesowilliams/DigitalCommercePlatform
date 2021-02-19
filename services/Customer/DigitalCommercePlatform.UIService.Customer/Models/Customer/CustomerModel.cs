using DigitalCommercePlatform.UIService.Customer.Models.Customer.Common;
using DigitalFoundation.Common.MongoDb.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Customer.Models.Customer
{
    [ExcludeFromCodeCoverage]
    public class CustomerModel
    {
        public Source Source { get; set; }
        public List<SourceRelModel> SourceRel { get; set; }
        public string Name { get; set; }
        public bool IsMaster { get; set; }
        public bool IsTechSelect { get; set; }
        public SalesStructureModel SalesStructure { get; set; }
        public List<AddressModel> Addresses { get; set; }
        public string Type { get; set; }
        public List<SalesDivisionModel> SalesDivision { get; set; }
        public List<CompanyModel> Companies { get; set; }
        public string DefaultCurrency { get; set; }
        public string EcomDiscountGroup { get; set; }
        public string LegalBlock { get; set; }
        public string TaxClassification { get; set; }
        public string CreditLimit { get; set; }
        public string CentralOrderBlock { get; set; }
        public string FpsFlag { get; set; }
        public string DeliveryBlock { get; set; }
        public List<FloorplannerModel> Floorplanners { get; set; }
        public List<FreightModel> Freight { get; set; }
        public List<ClassificationModel> Classifications { get; set; }
        public List<TaxCertificateModel> TaxCertificates { get; set; }
        public List<CarrierAccountNumberModel> CarrierAccountNumbers { get; set; }
        public List<CreditModel> Credit { get; set; }
        public DateTime? Updated { get; set; }
    }
}
