module "dns-records" {
  source               = "../../../common/aem/modules/dns-records"
  zone_name            = var.zone_name
  dns_rg               = var.dns_rg
  dns_a_records = {
      "us-qa-author" = "52.188.33.28",
       "us-qa"       = "52.188.33.28"
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

