using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract
{
    [ExcludeFromCodeCoverage]
    public class ResponseBase<T>
    {
        public T Content { get; set; }
        public ErrorInformation Error { get; set; } = new ErrorInformation();
    }

    [ExcludeFromCodeCoverage]
    public class ErrorInformation
    {
        public string Code { get; set; } = string.Empty;
        public List<string> Messages { get; set; } = new List<string>();
        public bool IsError { get; set; }

    }
}