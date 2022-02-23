//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models.Renewal.Internal;
using System;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Export.Models.Renewal
{
    public interface IBaseResponseModel
    {
        NameModel AccountOwner { get; set; }
        string ActiveFlag { get; set; }
        DateTime Created { get; set; }
        string Creator { get; set; }
        string Currency { get; set; }
        string CustomerPO { get; set; }
        string Description { get; set; }
        string DocumentType { get; set; }
        string EndUserPO { get; set; }
        DateTime Expiry { get; set; }
        decimal FEMAmount { get; set; }
        decimal FEMPercentage { get; set; }
        NameModel LastUpdatedBy { get; set; }
        ValueModel Level { get; set; }
        decimal NSMAmount { get; set; }
        decimal NSMPercentage { get; set; }
        List<OrderModel> Orders { get; set; }
        decimal POMAmount { get; set; }
        decimal POMPercentage { get; set; }
        decimal Price { get; set; }
        string QuoteType { get; set; }
        string Request { get; set; }
        decimal Revision { get; set; }
        SalesTeamModel SalesArea { get; set; }
        SalesTeamModel SalesTeam { get; set; }
        decimal SAMAmount { get; set; }
        decimal SAMPercentage { get; set; }
        string Status { get; set; }
        string StatusNotes { get; set; }
        decimal SubRevision { get; set; }
        SalesTeamModel SuperSalesArea { get; set; }
        ValueModel Type { get; set; }
        DateTime Updated { get; set; }
        List<ValueModel> VendorReference { get; set; }
    }
}