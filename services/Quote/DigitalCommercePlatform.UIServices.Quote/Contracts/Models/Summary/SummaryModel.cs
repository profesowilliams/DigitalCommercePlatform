using DigitalFoundation.AppServices.Quote.Models.Summary.Internal;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalFoundation.AppServices.Quote.Models.Summary
{
    [ExcludeFromCodeCoverage]
    public class SummaryModel
    {
        public SourceModel Source { get; set; }
        public decimal Revision { get; set; }
        public decimal SubRevision { get; set; }
        public string ActiveFlag { get; set; }
        public string Request { get; set; }
        public string EndUserPO { get; set; }
        public string CustomerPO { get; set; }
        public decimal Price { get; set; }
        public string Currency { get; set; }
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
        public EndUserModel EndUser { get; set; }
        public List<OrderModel> Orders { get; set; }
        public List<VendorReferenceModel> VendorReference { get; set; }
    }
}