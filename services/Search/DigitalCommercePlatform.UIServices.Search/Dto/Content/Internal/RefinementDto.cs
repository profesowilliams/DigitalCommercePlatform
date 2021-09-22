//2021 (c) Tech Data Corporation -. All Rights Reserved.
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Search.Dto.Content.Internal
{
    public class RefinementDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<OptionDto> Options{ get; set; }
    }
}
