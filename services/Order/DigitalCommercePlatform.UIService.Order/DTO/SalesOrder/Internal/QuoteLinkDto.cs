using DigitalFoundation.Common.MongoDb.Models;
using System;

namespace DigitalCommercePlatform.UIService.Order.DTO.SalesOrder.Internal
{
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

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Major Bug", "S3249:Classes directly extending \"object\" should not call \"base\" in \"GetHashCode\" or \"Equals\"", Justification = "<Pending>")]
        public override bool Equals(object obj)
        {
            return (obj is Source && base.Equals(obj) && Revision == ((QuoteLinkDto)obj).Revision && SubRevision == ((QuoteLinkDto)obj).SubRevision && Group == ((QuoteLinkDto)obj).Group && TargetSystem == ((QuoteLinkDto)obj).TargetSystem);
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Blocker Code Smell", "S3875:\"operator==\" should not be overloaded on reference types", Justification = "<Pending>")]
        public static bool operator ==(QuoteLinkDto pLeft, QuoteLinkDto pRight)
        {
            if (object.ReferenceEquals(pLeft, null))
                return object.ReferenceEquals(pRight, null);
            return pLeft.Equals(pRight);
        }

        public static bool operator !=(QuoteLinkDto pLeft, QuoteLinkDto pRight)
        {
            if (object.ReferenceEquals(pLeft, null))
                return object.ReferenceEquals(pRight, null);
            return !pLeft.Equals(pRight);
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Globalization", "CA1307:Specify StringComparison", Justification = "<Pending>")]
        public override int GetHashCode()
        {
            return ToString().GetHashCode();
        }
    }
}