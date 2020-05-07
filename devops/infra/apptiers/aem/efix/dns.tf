module "dns-records" {
  source               = "../common/modules/dns-records"
  zone_name            = var.zone_name
  dns_rg               = var.dns_rg
  dns_a_records = {
      "us-efix-author" = "172.23.132.22",
       "us-efix"       = "172.23.132.22"
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

