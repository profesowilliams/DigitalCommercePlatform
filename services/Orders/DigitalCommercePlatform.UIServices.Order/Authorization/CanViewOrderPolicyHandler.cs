//2022 (c) Tech Data Corporation -. All Rights Reserved.
using System.Linq;
using System.Threading.Tasks;
using DigitalFoundation.Common.Features.Contexts.Constants;
using DigitalFoundation.Common.Features.Contexts.Models;
using Microsoft.AspNetCore.Authorization;
using Newtonsoft.Json;

namespace DigitalCommercePlatform.UIServices.Order.Authorization
{
    public class CanViewOrderPolicyHandler : AuthorizationHandler<CanViewOrderRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, CanViewOrderRequirement requirement)
        {
            if (!context.User.HasClaim(c => c.Type == UserClaimTypes.Role)) return Task.CompletedTask;
            if (!context.User.HasClaim(c => c.Type == UserClaimTypes.ActiveCustomer || string.IsNullOrEmpty(c.Value))) return Task.CompletedTask;

            var activeCustomer = JsonConvert.DeserializeObject<Customer>(context.User.FindFirst(c => c.Type == UserClaimTypes.ActiveCustomer)!.Value);
            var userRoles = context.User.FindAll(c => c.Type == UserClaimTypes.Role)
                .Select(c => JsonConvert.DeserializeObject<Role>(c.Value))
                .Where(r => r.AccountId.Trim('0') == activeCustomer!.CustomerNumber.Trim('0'));

            if (userRoles.Any(r => 
                    r.Entitlement is "CanViewInvoices" or "CanViewOrders"))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }
    }
}
