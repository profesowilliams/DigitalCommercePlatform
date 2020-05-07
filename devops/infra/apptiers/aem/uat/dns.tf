module "dns-records" {
  source               = "../common/modules/dns-records"
  zone_name            = var.zone_name
  dns_rg               = var.dns_rg
  dns_a_records = {
      "us-uat-author" = "172.23.132.21",
       "us-uat"       = "172.23.132.21"
     }
}

#module "dns-records" {
#  source               = "../common/modules/dns-records"
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

