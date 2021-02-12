using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Browse.DTO.Cart
{
    public class GetBasketOutputDto
    {
        public BasketDto BasketHeader { get; set; }

        /// <summary>
        /// Gets or sets Basket Line details used for records selection. Result list will contain only records tagged with all these basket line values.
        /// </summary>
        public List<BasketLineDto> BasketLine { get; } = new List<BasketLineDto>();

        public List<BasketNotesStatusDto> BasketNotes { get; } = new List<BasketNotesStatusDto>();

        //Basket Product details
        public void AddBasketLine(List<BasketLineDto> basketLine)
        {
            BasketLine.Clear();
            BasketLine.AddRange(basketLine);
        }

        public void AddBasketNote(List<BasketNotesStatusDto> basketNotes)
        {
            BasketNotes.Clear();
            BasketNotes.AddRange(basketNotes);
        }
    }
}