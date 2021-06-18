using AutoMapper;
using DigitalCommercePlatform.UIServices.Browse.Models.Catalogue;
using System.Linq;

namespace DigitalCommercePlatform.UIServices.Browse.Infrastructure.Mappings
{
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

            CreateMap<CategoryDto, CatalogResponse>()
               .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
               .ForMember(dest => dest.Children, opt => opt.MapFrom(src => src.Subcategories))
               .ForMember(dest => dest.Key, opt => opt.MapFrom(src => src.Id.ToString()));

            CreateMap<CategoryDto, CatalogModel>()
                           .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
                           .ForMember(dest => dest.Catalogs, opt => opt.MapFrom(src => src.Subcategories))
                           .ForMember(dest => dest.Key, opt => opt.MapFrom(src => src.Id.ToString()));

            CreateMap<CatalogModel, CatalogResponse>()
                .ForMember(dest => dest.Children, opt => opt.MapFrom(src => src.Catalogs));
        }
    }
}