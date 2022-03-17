//2022 (c) Tech Data Corporation -. All Rights Reserved.

namespace DigitalCommercePlatform.UIServices.Browse.Models
{
    public class DropdownElementModel<T>
    {
        public T Id { get; set; }
        public bool Selected { get; set; }
        public string Name { get; set; }
    }
}