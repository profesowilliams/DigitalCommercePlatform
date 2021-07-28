using System;

namespace DigitalCommercePlatform.UIServices.Commerce.Infrastructure.ExceptionHandling
{
    [Serializable]
    enum UIServiceExceptionCode
    {
        GenericBadRequestError = 1001,
        GenericServerError = 1002,
        QuoteCreationFailed = 1003,
    }
}
