using System;
using System.Runtime.Serialization;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Catalog.Exceptions
{
    [ExcludeFromCodeCoverage]
    public class CatalogNotFoundException : Exception
    {
        public CatalogNotFoundException()
        {
        }

        public CatalogNotFoundException(string message) : base(message)
        {
        }

        public CatalogNotFoundException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected CatalogNotFoundException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
