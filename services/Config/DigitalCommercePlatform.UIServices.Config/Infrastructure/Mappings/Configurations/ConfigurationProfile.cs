using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Configurations.Resolvers;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal;
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
                .ForMember(d => d.SortByAscending, o => o.MapFrom<SortByResolver>())
                ;
            CreateMap<SummaryDto, Configuration>()
                .ForMember(d => d.ConfigId, o => o.MapFrom(s => s.Source.Id))
                .ForMember(d => d.ConfigurationType, o => o.MapFrom(s => s.Source.Type))
                .ForMember(d => d.CreatedOn, o => o.MapFrom(s => s.Created))
                .ForMember(d => d.Vendor, o => o.MapFrom(s => s.Vendor.Name))
                .ForMember(d => d.EndUserName, o => o.MapFrom(s => s.EndUser.Name))
                .ForMember(d => d.ConfigName , o => o.Ignore())
                .ForMember(d => d.TdQuoteId , o => o.Ignore())
                .ForMember(d => d.VendorQuoteId , o => o.Ignore())
                .ForMember(d => d.Action , o => o.Ignore())
                .ForMember(d => d.Details , o => o.Ignore())
                ;
            CreateMap<DetailedDto, Configuration>()
                .ForMember(d => d.ConfigId, o => o.MapFrom(s => s.Source.Id))
                .ForMember(d => d.ConfigurationType, o => o.MapFrom(s => s.Source.Type))
                .ForMember(d => d.CreatedOn, o => o.MapFrom(s => s.Created))
                .ForMember(d => d.Vendor, o => o.MapFrom(s => s.Vendor.Name))
                .ForMember(d => d.EndUserName, o => o.MapFrom(s => s.EndUser.Name))
                .ForMember(d => d.ConfigName, o => o.Ignore())
                .ForMember(d => d.TdQuoteId, o => o.Ignore())
                .ForMember(d => d.VendorQuoteId, o => o.Ignore())
                .ForMember(d => d.Action, o => o.Ignore())
                .ForMember(d => d.Details, o => o.Ignore())
                ;
        }
    }
}