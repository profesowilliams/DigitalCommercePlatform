//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System;

namespace DigitalCommercePlatform.UIServices.Account.Services
{
    public sealed class DefaultTimeProvider : ITimeProvider
    {
        public DateTime Today => DateTime.Today;
    }
}
