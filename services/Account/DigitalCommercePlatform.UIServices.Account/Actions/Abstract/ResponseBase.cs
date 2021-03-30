using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Account.Actions.Abstract
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
        public int Code { get; set; }
        public string Message { get; set; } = string.Empty;
        public bool IsError { get; set; }

    }
}