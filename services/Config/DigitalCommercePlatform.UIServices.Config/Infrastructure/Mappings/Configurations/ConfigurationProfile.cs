using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Actions.GetRecentConfigurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Configurations
{
    [ExcludeFromCodeCoverage]
    public class ConfigurationProfile : Profile
    {
        public ConfigurationProfile()
        {
            CreateMap<List<Configuration>, GetConfigurations.Response>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src));

            CreateMap<Models.Configurations.FindModel, Models.Configurations.Internal.FindModel>();
            CreateMap<SummaryDto, Configuration>()
                .ForMember(d => d.ConfigId, o => o.MapFrom(s => s.Source.Id))
                .ForMember(d => d.ConfigurationType, o => o.MapFrom(s => s.Source.Type))
                .ForMember(d => d.CreatedOn, o => o.MapFrom(s => s.Created))
                .ForMember(d => d.Vendor, o => o.MapFrom(s => s.Vendor.Name))
                .ForMember(d => d.EndUserName, o => o.MapFrom(s => s.EndUser.Name))
                ;
            CreateMap<DetailedDto, Configuration>()
                .ForMember(d => d.ConfigId, o => o.MapFrom(s => s.Source.Id))
                .ForMember(d => d.ConfigurationType, o => o.MapFrom(s => s.Source.Type))
                .ForMember(d => d.CreatedOn, o => o.MapFrom(s => s.Created))
                .ForMember(d => d.Vendor, o => o.MapFrom(s => s.Vendor.Name))
                .ForMember(d => d.EndUserName, o => o.MapFrom(s => s.EndUser.Name))
                ;
        }
    }
}