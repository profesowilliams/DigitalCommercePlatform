//2021 (c) Tech Data Corporation -. All Rights Reserved.

using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace DigitalCommercePlatform.UIServices.Renewal.Dto.Renewals
{
    [ExcludeFromCodeCoverage]
    public class ResponseSummaryDto
    {
        public List<SummaryDto> Data { get; set; }
        public int Count { get; set; }
    }
}
