using DigitalCommercePlatform.UIServices.Browse.DTO.Response;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DigitalCommercePlatform.UIServices.Browse.DTO.Request
{
    public class GetMenuRequest :IRequest<GetMenuResponse>
    {
        public string Id { get; set; }
        public string Site { get; set; }
        public string SalesOrganization { get; set; }
        public string Country { get; set; }
        public string TenantId { get; set; }
        public string Language { get; set; }
    }
}
