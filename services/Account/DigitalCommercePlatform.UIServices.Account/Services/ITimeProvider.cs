//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public interface ITimeProvider
    {
        DateTime Today { get; }
    }
}
