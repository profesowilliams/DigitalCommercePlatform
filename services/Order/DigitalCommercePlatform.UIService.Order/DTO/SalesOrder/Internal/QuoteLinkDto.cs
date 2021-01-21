using DigitalFoundation.Common.MongoDb.Models;
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class QuoteLinkDto : Source //Sync with Quote.Source
    {
        public string Revision { get; set; }

        public string SubRevision { get; set; }

        public string Group { get; set; }

        public string Request { get; set; }

        public string TargetSystem { get; set; }

        public override String ToString()
        {
            return base.ToString() + $"{TargetSystem ?? ""}.{Revision ?? ""}.{SubRevision ?? ""}.{Group ?? ""}.{Request ?? ""}";
        }

        public override bool Equals(object obj)
        {
            return (obj is Source && base.Equals(obj) && Revision == ((QuoteLinkDto)obj).Revision && SubRevision == ((QuoteLinkDto)obj).SubRevision && Group == ((QuoteLinkDto)obj).Group && TargetSystem == ((QuoteLinkDto)obj).TargetSystem);
        }

        public static bool operator ==(QuoteLinkDto pLeft, QuoteLinkDto pRight)
        {
            if (pLeft is null)
                return pRight is null;
            return pLeft.Equals(pRight);
        }

        public static bool operator !=(QuoteLinkDto pLeft, QuoteLinkDto pRight)
        {
            if (pLeft is null)
                return !(pRight is null);
            return !pLeft.Equals(pRight);
        }

        public override int GetHashCode()
        {
            return ToString().GetHashCode();
        }
    }
}