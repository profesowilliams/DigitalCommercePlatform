module "dns-records" {
  source               = "../../../common/aem/modules/dns-records"
  zone_name            = var.zone_name
  dns_rg               = var.dns_rg
  dns_a_records = {
      "us-dev-author" = "52.151.247.149",
       "us-dev"       = "52.151.247.149"
     }
}

#module "dns-records" {
#  source               = "../../../common/aem/modules/dns-records"
#  zone_name            = var.zone_name
#  dns_rg               = var.dns_rg
# dns_cname_records = {
#      
#   record = [
#       "us-dev",
#       "us-dev-author"
#   ]
#   value = [
#        "test.dns.com", 
#        "test.dns.com"
#]
#     }
# }

