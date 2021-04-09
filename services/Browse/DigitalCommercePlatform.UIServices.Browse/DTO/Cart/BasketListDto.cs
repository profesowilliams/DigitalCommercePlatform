using System;

namespace DigitalCommercePlatform.UIServices.Browse.DTO.Cart
{
    public class BasketListDto
    {
        public int BasketId { get; set; }
        public string BasketName { get; set; }
        public DateTime CreateDate { get; set; }
        public int NumberOfLines { get; set; }
    }
}