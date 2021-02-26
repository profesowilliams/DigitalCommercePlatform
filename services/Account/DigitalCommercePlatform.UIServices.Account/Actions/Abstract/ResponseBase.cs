namespace DigitalCommercePlatform.UIServices.Account.Actions.Abstract
{
    public abstract class ResponseBase<T>
    {
        public T Content { get; set; }

        public virtual bool IsError { get; set; }
        public string ErrorCode { get; set; }

        public ResponseBase(T content)
        {
            Content = content;
        }
    }
}
