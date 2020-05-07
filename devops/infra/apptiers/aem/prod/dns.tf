module "dns-records" {
  source               = "../common/modules/dns-records"
  zone_name            = var.zone_name
  dns_rg               = var.dns_rg
  dns_a_records = {
      "us-dev-author" = "172.23.0.5",
       "us-dev"       = "172.23.0.5"
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

