//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalFoundation.Common.MongoDb.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.Model.Customer
{
    /// <summary>
    /// Response object from customer core service, isolated from models or core services changes. This prevents app service from breaking on renames or properties removal in core service's response.
    /// </summary>
    ///
    [ExcludeFromCodeCoverage]
    public class CustomerModel
    {
        public Source Source { get; set; }
        public IEnumerable<SourceRelModel> SourceRel { get; set; }
        public string Name { get; set; }
        public bool IsMaster { get; set; }
        public bool IsTechSelect { get; set; }
        public SalesStructureModel SalesStructure { get; set; }
        public IEnumerable<AddressModel> Addresses { get; set; }
        public string Type { get; set; }
        public IEnumerable<SalesDivisionModel> SalesDivision { get; set; }
        public IEnumerable<CompanyModel> Companies { get; set; }
        public string DefaultCurrency { get; set; }
        public string EcomDiscountGroup { get; set; }
        public string LegalBlock { get; set; }
        public string TaxClassification { get; set; }
        public string CreditLimit { get; set; }
        public string CentralOrderBlock { get; set; }
        public string FpsFlag { get; set; }
        public string DeliveryBlock { get; set; }
        public IEnumerable<FloorplannerModel> Floorplanners { get; set; }
        public IEnumerable<FreightModel> Freight { get; set; }
        public IEnumerable<ClassificationModel> Classifications { get; set; }
        public IEnumerable<TaxCertificateModel> TaxCertificates { get; set; }
        public IEnumerable<CarrierAccountNumberModel> CarrierAccountNumbers { get; set; }
        public IEnumerable<CreditModel> Credit { get; set; }
        public DateTime? Updated { get; set; }
    }
}
