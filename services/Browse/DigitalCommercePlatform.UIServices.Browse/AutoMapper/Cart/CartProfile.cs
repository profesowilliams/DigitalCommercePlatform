using AutoMapper;
using System.Collections.Generic;
using DigitalCommercePlatform.UIServices.Browse.DTO.Cart;
using DigitalCommercePlatform.UIServices.Browse.Models.Cart;

namespace DigitalCommercePlatform.UIServices.Browse.AutoMapper.Cart
{
    public class CartProfile : Profile
    {
        public CartProfile()
        {
            CreateMap<CartItem, ResponseCartListItem>();
            CreateMap<CartProductItem, ResponseCartProductListItem>();
            CreateMap<CartProductItem, ResponseCartProductListItem>();
            CreateMap<List<AddProductsItemRequestModel>, List<AddProductsItemRequestModel>>();
            CreateMap<AddProductsItemRequestModel, AddProductsItemRequestModel>();
            CreateMap<CartProductItem, ResponseCartProductListItem>();
            CreateMap<List<DeleteProductsItemRequestModel>, List<DeleteProductsItemRequestModel>>();
            CreateMap<DeleteProductsItemRequestModel, DeleteProductsItemRequestModel>();
            CreateMap<CartItem, ResponseDto>();
            CreateMap<CartItem, ResponseDto>();
            CreateMap<CartItem, ResponseDto>();
            CreateMap<CartProductItem, ResponseCartProductListItem>();
        }
    }
}