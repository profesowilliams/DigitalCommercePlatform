module "dns-records" {
  source               = "../../../common/solr/modules/dns-records"
  zone_name            = var.zone_name
  dns_rg               = var.dns_rg
  dns_a_records = {
      "us-dev-solr" = "172.23.132.20"
     }
}

#module "dns-records" {
#  source               = "../../../common/solr/modules/dns-records"
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

