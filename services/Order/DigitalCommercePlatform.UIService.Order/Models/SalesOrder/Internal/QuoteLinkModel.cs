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

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Major Bug", "S3249:Classes directly extending \"object\" should not call \"base\" in \"GetHashCode\" or \"Equals\"", Justification = "<Pending>")]
        public override bool Equals(object obj)
        {
            return (obj is Source && base.Equals(obj) && Revision == ((QuoteLinkModel)obj).Revision && SubRevision == ((QuoteLinkModel)obj).SubRevision && Group == ((QuoteLinkModel)obj).Group && TargetSystem == ((QuoteLinkModel)obj).TargetSystem);
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Blocker Code Smell", "S3875:\"operator==\" should not be overloaded on reference types", Justification = "<Pending>")]
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

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Globalization", "CA1307:Specify StringComparison", Justification = "<Pending>")]
        public override int GetHashCode()
        {
            return ToString().GetHashCode();
        }
    }
}