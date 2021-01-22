using DigitalFoundation.Common.MongoDb.Models;
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Order.Models.SalesOrder.Internal
{
    [ExcludeFromCodeCoverage]
    public class QuoteLinkModel : Source //Sync with Quote.Source
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
            return (obj is Source && base.Equals(obj) && Revision == ((QuoteLinkModel)obj).Revision && SubRevision == ((QuoteLinkModel)obj).SubRevision && Group == ((QuoteLinkModel)obj).Group && TargetSystem == ((QuoteLinkModel)obj).TargetSystem);
        }

        public static bool operator ==(QuoteLinkModel pLeft, QuoteLinkModel pRight)
        {
            if (pLeft is null)
                return pRight is null;
            return pLeft.Equals(pRight);
        }

        public static bool operator !=(QuoteLinkModel pLeft, QuoteLinkModel pRight)
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