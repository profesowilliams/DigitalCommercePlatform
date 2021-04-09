using DigitalFoundation.Common.MongoDb.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Browse.DTO.Customer
{
    /// <summary>
    /// Response object from customer core service, isolated from models or core services changes. This prevents app service from breaking on renames or properties removal in core service's response.
    /// </summary>
    ///
    [ExcludeFromCodeCoverage]
    public class CustomerDto
    {
        public Source Source { get; set; }
        public List<SourceRelDto> SourceRel { get; set; }
        public string Name { get; set; }
        public bool IsMaster { get; set; }
        public bool IsTechSelect { get; set; }
        public SalesStructureDto SalesStructure { get; set; }
        public List<AddressDto> Addresses { get; set; }
        public string Type { get; set; }
        public List<SalesDivisionDto> SalesDivision { get; set; }
        public List<CompanyDto> Companies { get; set; }
        public string DefaultCurrency { get; set; }
        public string EcomDiscountGroup { get; set; }
        public string LegalBlock { get; set; }
        public string TaxClassification { get; set; }
        public string CreditLimit { get; set; }
        public string CentralOrderBlock { get; set; }
        public string FpsFlag { get; set; }
        public string DeliveryBlock { get; set; }
        public List<FloorplannerDto> Floorplanners { get; set; }
        public List<FreightDto> Freight { get; set; }
        public List<ClassificationDto> Classifications { get; set; }
        public List<TaxCertificateDto> TaxCertificates { get; set; }
        public List<CarrierAccountNumberDto> CarrierAccountNumbers { get; set; }
        public List<CreditDto> Credit { get; set; }
        public DateTime? Updated { get; set; }
    }
}