using System;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public interface ITimeProvider
    {
        DateTime Today { get; }
    }
}