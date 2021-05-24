using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal;
using DigitalCommercePlatform.UIServices.Config.Models.Estimations;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Configurations
{
    [ExcludeFromCodeCoverage]
    public class ConfigurationProfile : Profile
    {
        public ConfigurationProfile()
        {
            CreateMap<Models.Configurations.FindModel, Models.Configurations.Internal.FindModel>()
                .ForMember(d => d.Page, o => o.MapFrom(s => s.PageNumber))
                ;
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

            CreateMap<SummaryDto, Estimation>()
                .ForMember(d => d.ConfigId, o => o.MapFrom(s => s.Source.Id))
                .ForMember(d => d.ConfigurationType, o => o.MapFrom(s => s.Source.Type))
                .ForMember(d => d.Vendor, o => o.MapFrom(s => s.Vendor.Name))
                ;
            CreateMap<DetailedDto, Estimation>()
                .ForMember(d => d.ConfigId, o => o.MapFrom(s => s.Source.Id))
                .ForMember(d => d.ConfigurationType, o => o.MapFrom(s => s.Source.Type))
                .ForMember(d => d.Vendor, o => o.MapFrom(s => s.Vendor.Name))
                ;
        }
    }
}