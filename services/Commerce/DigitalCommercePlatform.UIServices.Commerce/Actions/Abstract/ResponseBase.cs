using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Commerce.Actions.Abstract
{
    [ExcludeFromCodeCoverage]
    public class ResponseBase<T>
    {
        public T Content { get; set; }
        public ErrorInfo ErrorInfo { get; set; } = new ErrorInfo();
    }

    [ExcludeFromCodeCoverage]
    public class ErrorInfo
    {
        public string Code { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsError { get; set; }

    }
}