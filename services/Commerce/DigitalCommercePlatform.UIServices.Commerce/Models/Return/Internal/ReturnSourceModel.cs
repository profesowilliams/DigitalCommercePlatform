//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalFoundation.Common.MongoDb.Models;
using System;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Models.Return.Internal
{
    [ExcludeFromCodeCoverage]
    public class ReturnSourceModel : Source
    {
        public string ReturnType { get; set; }

        public override string ToString()
        {
            return base.ToString() + $".{ReturnType}";
        }

        public override bool Equals(object obj)
        {
            return obj is ReturnSourceModel && base.Equals(obj) && ReturnType == ((ReturnSourceModel)obj).ReturnType;
        }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Blocker Code Smell", "S3875:\"operator==\" should not be overloaded on reference types", Justification = "<Pending>")]
        public static bool operator ==(ReturnSourceModel pLeft, ReturnSourceModel pRight)
        {
            if (object.ReferenceEquals(pLeft, null))
                return object.ReferenceEquals(pRight, null);
            return pLeft.Equals(pRight);
        }

        public static bool operator !=(ReturnSourceModel pLeft, ReturnSourceModel pRight)
        {
            if (object.ReferenceEquals(pLeft, null))
                return object.ReferenceEquals(pRight, null);
            return !pLeft.Equals(pRight);
        }

        public override int GetHashCode()
        {
            return ToString().GetHashCode(StringComparison.InvariantCulture);
        }
    }
}