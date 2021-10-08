//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Common;
using DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Configurations.Resolvers;
using DigitalCommercePlatform.UIServices.Config.Models.Common;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations;
using DigitalCommercePlatform.UIServices.Config.Models.Configurations.Internal;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Config.Infrastructure.Mappings.Configurations
{
    [ExcludeFromCodeCoverage]
    public class ConfigurationProfile : ProfileBase
    {
        public ConfigurationProfile()
        {
            CreateMap<Paginated, Models.Configurations.Internal.FindModel>()
                .Include<Models.Configurations.FindModel, Models.Configurations.Internal.FindModel>()
                .ForMember(d => d.Page, o => o.MapFrom(s => s.PageNumber))
                .ForMember(d => d.Id, o => o.Ignore())
                .ForMember(d => d.Details, o => o.Ignore())
                .ForMember(d => d.Type, o => o.Ignore())
                .ForMember(d => d.Manufacturer, o => o.Ignore())
                .ForMember(d => d.ResellerName, o => o.Ignore())
                .ForMember(d => d.ResellerId, o => o.Ignore())
                .ForMember(d => d.CreatedFrom, o => o.Ignore())
                .ForMember(d => d.CreatedTo, o => o.Ignore())
                .ForMember(d => d.EndUser, o => o.Ignore())
                .ForMember(d => d.SortBy, o => o.Ignore())
                .ForMember(d => d.SortByAscending, o => o.Ignore())
                .ForMember(d => d.WithPaginationInfo, o => o.Ignore())
                .ForMember(d => d.Name, o => o.Ignore())
                ;

            CreateMap<Models.Configurations.FindModel, Models.Configurations.Internal.FindModel>()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Id))
                .ForMember(d => d.Details, o => o.MapFrom(s => s.Details))
                .ForMember(d => d.Type, o => o.MapFrom(s => s.Type))
                .ForMember(d => d.Manufacturer, o => o.MapFrom(s => s.Manufacturer))
                .ForMember(d => d.ResellerName, o => o.MapFrom(s => s.ResellerName))
                .ForMember(d => d.ResellerId, o => o.MapFrom(s => s.ResellerId))
                .ForMember(d => d.CreatedFrom, o => o.MapFrom(s => s.CreatedFrom))
                .ForMember(d => d.CreatedTo, o => o.MapFrom(s => s.CreatedTo))
                .ForMember(d => d.EndUser, o => o.MapFrom(s => s.EndUser))
                .ForMember(d => d.SortBy, o => o.MapFrom(s => s.SortBy))
                .ForMember(d => d.Name, o => o.MapFrom(s => s.ConfigName))
                .ForMember(d => d.SortByAscending, o => o.MapFrom<SortByResolver>())
                .ForMember(d => d.WithPaginationInfo, o => o.Ignore())
                ;

            CreateMap<SummaryDto, Configuration>()
                .ForMember(d => d.ConfigId, o => o.MapFrom(s => s.Source.Id))
                .ForMember(d => d.ConfigurationType, o => o.MapFrom(s => s.Source.Type))
                .ForMember(d => d.Created, o => o.MapFrom(s => s.Created))
                .ForMember(d => d.Vendor, o => o.MapFrom(s => s.Vendor.Name))
                .ForMember(d => d.EndUserName, o => o.MapFrom(s => s.EndUser.Name))
                .ForMember(d => d.ConfigName , o => o.MapFrom(s => s.Name))
                .ForMember(d => d.VendorQuoteId , o => o.Ignore())
                .ForMember(d => d.Expires , o => o.MapFrom(s => s.ExpiryDate))
                .ForMember(d => d.Action , o => o.Ignore())
                .ForMember(d => d.Quotes , o => o.Ignore())
                ;
            CreateMap<DetailedDto, Configuration>()
                .ForMember(d => d.ConfigId, o => o.MapFrom(s => s.Source.Id))
                .ForMember(d => d.ConfigurationType, o => o.MapFrom(s => s.Source.Type))
                .ForMember(d => d.Created, o => o.MapFrom(s => s.Created))
                .ForMember(d => d.Vendor, o => o.MapFrom(s => s.Vendor.Name))
                .ForMember(d => d.EndUserName, o => o.MapFrom(s => s.EndUser.Name))
                .ForMember(d => d.Expires, o => o.MapFrom(s => s.ExpiryDate))
                .ForMember(d => d.ConfigName, o => o.MapFrom(s => s.Name))
                .ForMember(d => d.VendorQuoteId, o => o.Ignore())
                .ForMember(d => d.Action, o => o.Ignore())
                .ForMember(d => d.Quotes, o => o.Ignore())
                ;
        }
    }
}
