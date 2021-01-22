// This file is used by Code Analysis to maintain SuppressMessage
// attributes that are applied to this project.
// Project-level suppressions either have no target or are given
// a specific target and scoped to a namespace, type, member, etc.

using System.Diagnostics.CodeAnalysis;

[assembly: SuppressMessage("Major Code Smell", "S125:Sections of code should not be commented out")]
[assembly: SuppressMessage("Design", "CA1062:Validate arguments of public methods")]
[assembly: SuppressMessage("Usage", "CA2227:Collection properties should be read only")]
[assembly: SuppressMessage("Performance", "CA1819:Properties should not return arrays")]
[assembly: SuppressMessage("Design", "CA1002:Do not expose generic lists")]
[assembly: SuppressMessage("Design", "CA1031:Do not catch general exception types")]
[assembly: SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "<Pending>", Scope = "member", Target = "~M:DigitalCommercePlatform.UIService.Order.Controllers.OrderController.GetAsync(System.String)~System.Threading.Tasks.Task{DigitalCommercePlatform.UIService.Order.Models.SalesOrder.SalesOrderModel}")]
[assembly: SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "<Pending>", Scope = "member", Target = "~M:DigitalCommercePlatform.UIService.Order.Controllers.OrderController.GetMultiple(System.Collections.Generic.List{System.String})~System.Threading.Tasks.Task{System.Collections.Generic.IEnumerable{DigitalCommercePlatform.UIService.Order.Models.SalesOrder.SalesOrderModel}}")]
[assembly: SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "<Pending>", Scope = "member", Target = "~M:DigitalCommercePlatform.UIService.Order.Controllers.OrderController.SearchAsync(DigitalCommercePlatform.UIService.Order.Models.SalesOrder.FindRequestModel)~System.Threading.Tasks.Task{Microsoft.AspNetCore.Mvc.IActionResult}")]
[assembly: SuppressMessage("Design", "CA1052:Static holder types should be Static or NotInheritable", Justification = "<Pending>", Scope = "type", Target = "~T:DigitalCommercePlatform.UIService.Order.Actions.Order.DetailsofMultipleOrder.GetMultipleOrders")]
[assembly: SuppressMessage("Design", "CA1052:Static holder types should be Static or NotInheritable", Justification = "<Pending>", Scope = "type", Target = "~T:DigitalCommercePlatform.UIService.Order.Actions.Order.DetailsofOrder.GetOrder")]