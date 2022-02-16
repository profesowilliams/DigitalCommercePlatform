//2021 (c) Tech Data Corporation -. All Rights Reserved.
using AutoMapper;
using DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals.Internal;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals;
using DigitalCommercePlatform.UIServices.Renewal.Models.Renewals.Internal;
using System;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Renewal.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class RenewalProfile : Profile
    {
        public RenewalProfile()
        {
            CreateMap<DateTime, string>().ConvertUsing(dt => dt.ToString("MM/dd/yy"));

            CreateMap<AgreementDto, QuoteAgreementModel>();

            CreateMap<ItemDto, ItemModel>()
                .ForMember(dest => dest.Manufacturer, opt => opt.MapFrom<ItemManufacturerResolver>())
                .ForMember(dest => dest.TDNumber, opt => opt.MapFrom<ItemTDPartNumberResolver>())
                .ForMember(dest => dest.MFRNumber, opt => opt.MapFrom<ItemMfrPartNumberResolver>())
                .ForMember(dest => dest.ShortDescription, opt => opt.MapFrom<ItemMfrPartNameResolver>());
        }
    }

    [ExcludeFromCodeCoverage]
    public class ItemManufacturerResolver : IValueResolver<ItemDto, ItemModel, string>
    {
        public string Resolve(ItemDto source, ItemModel destination, string destMember, ResolutionContext context)
        {
            var description = source.Product.Any() ? source.Product.Where(p => p.Type.ToUpper().Equals("MANUFACTURER", StringComparison.Ordinal))?.FirstOrDefault()?.Manufacturer : string.Empty;
            return description;
        }
    }

    [ExcludeFromCodeCoverage]
    public class ItemTDPartNumberResolver : IValueResolver<ItemDto, ItemModel, string>
    {
        public string Resolve(ItemDto source, ItemModel destination, string destMember, ResolutionContext context)
        {
            var description = source.Product.Any() ? source.Product.Where(p => p.Type.ToUpper().Equals("TECHDATA", StringComparison.Ordinal))?.FirstOrDefault()?.Id : string.Empty;
            return description;
        }
    }

    [ExcludeFromCodeCoverage]
    public class ItemMfrPartNumberResolver : IValueResolver<ItemDto, ItemModel, string>
    {
        public string Resolve(ItemDto source, ItemModel destination, string destMember, ResolutionContext context)
        {
            var description = source.Product.Any() ? source.Product.Where(p => p.Type.ToUpper().Equals("MANUFACTURER", StringComparison.Ordinal))?.FirstOrDefault()?.Id : string.Empty;
            return description;
        }
    }

    [ExcludeFromCodeCoverage]
    public class ItemMfrPartNameResolver : IValueResolver<ItemDto, ItemModel, string>
    {
        public string Resolve(ItemDto source, ItemModel destination, string destMember, ResolutionContext context)
        {
            var description = source.Product.Any() ? source.Product.Where(p => p.Type.ToUpper().Equals("MANUFACTURER", StringComparison.Ordinal))?.FirstOrDefault()?.Name : string.Empty;
            return description;
        }
    }
}