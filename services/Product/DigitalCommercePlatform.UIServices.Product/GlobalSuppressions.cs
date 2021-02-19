// This file is used by Code Analysis to maintain SuppressMessage
// attributes that are applied to this project.
// Project-level suppressions either have no target or are given
// a specific target and scoped to a namespace, type, member, etc.

using System.Diagnostics.CodeAnalysis;

[assembly: SuppressMessage("Major Code Smell", "S125:Sections of code should not be commented out")]
[assembly: SuppressMessage("Naming", "CA1717:Only FlagsAttribute enums should have plural names")]
[assembly: SuppressMessage("Design", "CA1034:Nested types should not be visible")]
[assembly: SuppressMessage("Naming", "CA1724:Type names should not match namespaces")]
[assembly: SuppressMessage("Usage", "CA2227:Collection properties should be read only")]
[assembly: SuppressMessage("Performance", "CA1819:Properties should not return arrays")]
[assembly: SuppressMessage("Usage", "CA1801:Review unused parameters")]
[assembly: SuppressMessage("Design", "CA1031:Do not catch general exception types")]
[assembly: SuppressMessage("Design", "CA1052:Static holder types should be Static or NotInheritable")]
[assembly: SuppressMessage("Critical Code Smell", "S4487:Unread \"private\" fields should be removed")]
[assembly: SuppressMessage("Reliability", "CA2000:Dispose objects before losing scope", Justification = "<Pending>", Scope = "member", Target = "~M:DigitalCommercePlatform.UIServices.Product.Actions.Abstract.HandlerBase`1.GetAsync``1(System.String,System.String,System.Threading.CancellationToken)~System.Threading.Tasks.Task{``0}")]
[assembly: SuppressMessage("Reliability", "CA2007:Consider calling ConfigureAwait on the awaited task", Justification = "<Pending>", Scope = "member", Target = "~M:DigitalCommercePlatform.UIServices.Product.Actions.Abstract.HandlerBase`1.GetAsync``1(System.String,System.String,System.Threading.CancellationToken)~System.Threading.Tasks.Task{``0}")]
[assembly: SuppressMessage("Design", "CA1051:Do not declare visible instance fields", Justification = "<Pending>", Scope = "member", Target = "~F:DigitalCommercePlatform.UIServices.Product.Actions.Abstract.HandlerBase`1._httpClientFactory")]
[assembly: SuppressMessage("Design", "CA1051:Do not declare visible instance fields", Justification = "<Pending>", Scope = "member", Target = "~F:DigitalCommercePlatform.UIServices.Product.Actions.Abstract.HandlerBase`1._logger")]
[assembly: SuppressMessage("Design", "CA1054:URI-like parameters should not be strings", Justification = "<Pending>", Scope = "member", Target = "~M:DigitalCommercePlatform.UIServices.Product.Actions.Abstract.HandlerBase`1.GetAsync``1(System.String,System.String,System.Threading.CancellationToken)~System.Threading.Tasks.Task{``0}")]
[assembly: SuppressMessage("Design", "CA1062:Validate arguments of public methods", Justification = "<Pending>", Scope = "member", Target = "~M:DigitalCommercePlatform.UIServices.Product.Helpers.LogHelper.ExcludeHealthChecks(Microsoft.AspNetCore.Http.HttpContext,System.Double,System.Exception)~Serilog.Events.LogEventLevel")]
