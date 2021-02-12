using System;
using System.Runtime.Serialization;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIService.Catalogue.Exceptions
{
    [ExcludeFromCodeCoverage]
    public class CatalogueNotFoundException : Exception
    {
        public CatalogueNotFoundException()
        {
        }

        public CatalogueNotFoundException(string message) : base(message)
        {
        }

        public CatalogueNotFoundException(string message, Exception innerException) : base(message, innerException)
        {
        }

        protected CatalogueNotFoundException(SerializationInfo info, StreamingContext context) : base(info, context)
        {
        }
    }
}
