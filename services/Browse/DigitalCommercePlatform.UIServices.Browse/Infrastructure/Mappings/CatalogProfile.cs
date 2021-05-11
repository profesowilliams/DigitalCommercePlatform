using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using System.Diagnostics.CodeAnalysis;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings
{
    [ExcludeFromCodeCoverage]
    public class CatalogProfile : Profile
    {
        public CatalogProfile()
        {
            CreateMap<CategoryModel, CatalogResponse>()
               .ForMember(dest => dest.Key, opt => opt.MapFrom(src => src.Id))
               .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
               .ForMember(dest => dest.DocCount, opt => opt.MapFrom(src => src.ProductCount));

            CreateMap<CatalogDto, CatalogModel>()
                .ForPath(dest => dest.Catalogs, opt => opt.MapFrom(src => src.Catalogs.FirstOrDefault().Categories));
        }
    }
}