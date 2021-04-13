using System;
using System.Diagnostics.CodeAnalysis;
using System.Runtime.Serialization;

namespace DigitalCommercePlatform.UIServices.Commerce.Infrastructure.Filters
{
    [ExcludeFromCodeCoverage]
    [Serializable]
    public class UIServiceException : ApplicationException
    {
        public UIServiceException()
        {
        }

        public UIServiceException(string message)
            : base(message)
        {
        }

        public UIServiceException(string message, Exception inner)
            : base(message, inner)
        {
        }

        protected UIServiceException(SerializationInfo info, StreamingContext context)
            : base(info, context)
        {
        }
    }
}
