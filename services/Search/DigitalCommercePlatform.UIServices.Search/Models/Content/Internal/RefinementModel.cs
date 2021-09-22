//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Search.Models.Content.Internal
{
    public class RefinementModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<Option> Options { get; set; }
    }
    public class Option
    {
        public string Id { get; set; }
        public string Text { get; set; }
        public int Count { get; set; }
        public bool Selected { get; set; }
    }
}
