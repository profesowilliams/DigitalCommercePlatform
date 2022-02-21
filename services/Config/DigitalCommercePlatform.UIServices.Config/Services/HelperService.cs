//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System;

namespace DigitalCommercePlatform.UIServices.Config.Services
{
    public class HelperService : IHelperService
    {        
        public DateTime? GetDateParameter(DateTime date, string paramType) => paramType.ToLower() == "from"
        ? new DateTime(date.Year, date.Month, date.Day, 0, 0, 0)
        : new DateTime(date.Year, date.Month, date.Day, 23, 59, 59);
    }
}
