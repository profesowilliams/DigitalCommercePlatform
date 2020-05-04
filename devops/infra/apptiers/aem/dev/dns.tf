module "dnszone" {
  source       = "../common/modules/dnszone"
  zone_id      = var.zone_id
  type         = var.type
  records      = [
    		   var.aem-domain-author,
    		   var.aem-domain-publish
  		 ]
#  values = ["${var.host_name}.s1nextgen.com"]
   values = [var.incapsula_dns]
}

#module "dns_records_common_fqdn" {
#  source  = "../modules/dns"
#  zone_id = var.dns_zone_id
#  type    = "CNAME"
#  records = ["${var.environment_name}-appgateway"]
#  values  = [var.incapsula_dns]
#}