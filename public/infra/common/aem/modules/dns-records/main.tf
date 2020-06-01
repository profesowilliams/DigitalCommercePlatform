data "azurerm_resource_group" "dns_rg" {
  name     = var.dns_rg
}
data "azurerm_dns_zone" "zone_name" {
   name                = var.zone_name 
   resource_group_name = data.azurerm_resource_group.dns_rg.name

}
resource "azurerm_dns_a_record" "dns_records"{
  for_each = var.dns_a_records
  name                = each.key
  zone_name           = data.azurerm_dns_zone.zone_name.name
  resource_group_name = data.azurerm_resource_group.dns_rg.name
  ttl                 = 300
  records             = [each.value]
}

#resource "azurerm_dns_cname_record" "dns_records" {
#  for_each = var.dns_cname_records
#  name                = each.key
#  zone_name           = data.azurerm_dns_zone.zone_name.name
#  resource_group_name = data.azurerm_resource_group.dns_rg.name
#  ttl                 = 300
#  records             = [each.value]
#}



