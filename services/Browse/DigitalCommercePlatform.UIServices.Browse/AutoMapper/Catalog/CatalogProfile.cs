using AutoMapper;
using DigitalCommercePlatform.UIService.Browse.DTO.Catalogue;
using DigitalCommercePlatform.UIService.Browse.Models.Catalogue;
using DigitalCommercePlatform.UIService.Browse.DTO.Catalogue.Internal;
using DigitalCommercePlatform.UIService.Browse.Models.Catalogue.Internal;

namespace DigitalCommercePlatform.UIServices.Browse.AutoMapper
{
    public class CatalogProfile : Profile
    {
        public CatalogProfile()
        {
            CreateMap<CatalogHierarchyDto, CatalogHierarchyModel>();
            CreateMap<SourceDto, SourceModel>();
            CreateMap<NodeDto, NodeModel>();
        }
    }
}
