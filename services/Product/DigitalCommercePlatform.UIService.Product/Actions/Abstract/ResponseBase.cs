using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Product.Actions.Abstract
{
    [ExcludeFromCodeCoverage]
    public abstract class ResponseBase<T>
    {
        public T Content { get; set; }
        public virtual bool IsError { get; set; }
        public string ErrorCode { get; set; }
        protected ResponseBase(T content)
        {
            Content = content;
        }
    }
}
