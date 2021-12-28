//2021 (c) Tech Data Corporation -. All Rights Reserved.
using DigitalCommercePlatform.UIServices.Export.Models;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using DigitalCommercePlatform.UIServices.Export.Models.Order.Internal;
using AutoMapper;
using System.Collections.Generic;

namespace DigitalCommercePlatform.UIServices.Export.Infrastructure.Mappings.Export.Resolvers
{
    [ExcludeFromCodeCoverage]
    public class EndUserResolver : IValueResolver<OrderModel, OrderDetailModel, List<Address>>
    {
        public List<Address> Resolve(OrderModel source, OrderDetailModel destination, List<Address> destMember, ResolutionContext context)
        {
            var orderLines = source.Items.Where(x => x.EndUser != null).ToList();
            var lstEndUsers = new List<Address>();

            foreach (Item orderLine in orderLines)
            {
                if (!lstEndUsers.Where(a => a.CompanyName != null 
                                            && a.CompanyName.ToUpper().Contains(orderLine.EndUser.Name?.ToUpper()))
                                .Any()
                    )
                {
                    var address = new Address
                    {
                        City = string.IsNullOrWhiteSpace(orderLine.EndUser.Address.City) 
                            ? string.Empty 
                            : orderLine.EndUser.Address.City,
                        State = string.IsNullOrWhiteSpace(orderLine.EndUser.Address.State) 
                            ? string.Empty 
                            : orderLine.EndUser.Address.State,
                        Line1 = string.IsNullOrWhiteSpace(orderLine.EndUser.Address.Line1) 
                            ? string.Empty 
                            : orderLine.EndUser.Address.Line1,
                        Line2 = string.IsNullOrWhiteSpace(orderLine.EndUser.Address.Line2) 
                            ? string.Empty 
                            : orderLine.EndUser.Address.Line2,
                        Line3 = string.IsNullOrWhiteSpace(orderLine.EndUser.Address.Line3) 
                            ? string.Empty 
                            : orderLine.EndUser.Address.Line3,
                        Country = string.IsNullOrWhiteSpace(orderLine.EndUser.Address.Country) 
                            ? string.Empty 
                            : orderLine.EndUser.Address.Country,
                        Zip = string.IsNullOrWhiteSpace(orderLine.EndUser.Address.Zip) 
                            ? string.Empty 
                            : orderLine.EndUser.Address.Zip,
                        PostalCode = string.IsNullOrWhiteSpace(orderLine.EndUser.Address.Zip) 
                            ? string.Empty 
                            : orderLine.EndUser.Address.Zip,
                        CompanyName = string.IsNullOrWhiteSpace(orderLine.EndUser.Name) 
                            ? string.Empty 
                            : orderLine.EndUser.Name,
                        PhoneNumber = string.IsNullOrWhiteSpace(orderLine.EndUser.Contact?.Phone) 
                            ? string.Empty 
                            : orderLine.EndUser.Contact?.Phone,
                        Name = string.IsNullOrWhiteSpace(orderLine.EndUser.Contact?.Name) 
                            ? string.Empty 
                            : orderLine.EndUser.Contact?.Name,
                        ContactEmail = string.IsNullOrWhiteSpace(orderLine.EndUser.Contact?.Email) 
                            ? string.Empty 
                            : orderLine.EndUser.Contact?.Email,
                    };

                    if (!string.IsNullOrWhiteSpace(address.CompanyName) || !string.IsNullOrWhiteSpace(address.Name))
                        lstEndUsers.Add(address);
                }
            }
            return lstEndUsers;
        }
    }
}
