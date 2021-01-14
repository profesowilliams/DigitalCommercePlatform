using DigitalFoundation.Common.MongoDb.Entities;
using DigitalFoundation.Core.Publishers.Quote.Internal;
using DigitalFoundation.Core.Services.Quote.DTO.Internal;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.Core.Services.Quote.DTO
{
    [ExcludeFromCodeCoverage]
    [BsonDiscriminator("Quote")]
    public class QuoteDto : MongoDbEntityBase
    {
        public DateTime Published { get; set; }
        public SourceDto Source { get; set; }
        public string ActiveFlag { get; set; }
        public string Request { get; set; }
        public string EndUserPO { get; set; }
        public string CustomerPO { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; }
        public string DocumentType { get; set; }
        public TypeDto Type { get; set; }
        public LevelDto Level { get; set; }
        public string Creator { get; set; }
        public LastUpdatedByDto LastUpdatedBy { get; set; }
        public DateTime Created { get; set; }
        public DateTime Updated { get; set; }
        public DateTime Expiry { get; set; }
        public string Status { get; set; }
        public string StatusNotes { get; set; }
        public ResellerDto Reseller { get; set; }
        public ShipToDto ShipTo { get; set; }
        public EndUserDto EndUser { get; set; }
        public VendorSalesRepDto VendorSalesRep { get; set; }
        public BusinessManagerDto BusinessManager { get; set; }
        public DivisionManagerDto DivisionManager { get; set; }
        public DirectorDto Director { get; set; }
        public VendorSalesAssociateDto VendorSalesAssociate { get; set; }
        public SalesTeamDto SalesTeam { get; set; }
        public SalesAreaDto SalesArea { get; set; }
        public SuperSalesAreaDto SuperSalesArea { get; set; }
        public List<OrderDto> Orders { get; set; }
        public List<VendorReferenceDto> VendorReference { get; set; }
        public List<ItemDto> Items { get; set; }
        public List<AgreementDto> Agreements { get; set; }
        public string Description { get; set; }

        public override string ToString() => this.Source.ToString();
    }
}