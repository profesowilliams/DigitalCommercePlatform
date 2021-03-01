using DigitalCommercePlatform.UIServices.Config.Actions.GetConfigurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Config.Services
{
    public interface IConfigService
    {
        Task<RecentConfigurationsModel> GetConfigurations(FindModel request);
    }
}
