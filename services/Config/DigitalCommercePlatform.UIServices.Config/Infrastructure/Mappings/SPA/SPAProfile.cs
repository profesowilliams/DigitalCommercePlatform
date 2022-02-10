//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Config.Actions.Spa;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Common;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Spa
{
    [ExcludeFromCodeCoverage]
    public class SpaProfile : ProfileBase
    {
        public SpaProfile()
        {

            CreateMap<Models.SPA.SpaDetailModel, SpaDetails.Response>()
               .ForPath(d => d.Items, o => o.MapFrom(s => s));
        }
    }
}
