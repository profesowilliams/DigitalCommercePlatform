//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System;
namespace DigitalCommercePlatform.UIServices.Config.Services
{
    public interface IHelperService
    {
        public DateTime? GetDateParameter(DateTime date, string paramType);
    }
}
