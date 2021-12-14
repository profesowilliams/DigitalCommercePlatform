//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Config.Actions.SPA;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Common;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.SPA
{
    [ExcludeFromCodeCoverage]
    public class SPAProfile : ProfileBase
    {
        public SPAProfile()
        {

            CreateMap<Models.SPA.SpaDetailModel, SPADetails.Response>()
               .ForPath(d => d.Items, o => o.MapFrom(s => s));
        }
    }
}
