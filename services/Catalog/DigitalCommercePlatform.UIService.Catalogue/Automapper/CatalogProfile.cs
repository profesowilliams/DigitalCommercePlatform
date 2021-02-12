using AutoMapper;
using DigitalCommercePlatform.UIService.Catalogue.DTO;
using DigitalCommercePlatform.UIService.Catalogue.Models;
using DigitalCommercePlatform.UIService.Catalogue.DTO.Internal;
using DigitalCommercePlatform.UIService.Catalogue.Models.Internal;


namespace DigitalCommercePlatform.UIService.Catalogue.Automapper
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
