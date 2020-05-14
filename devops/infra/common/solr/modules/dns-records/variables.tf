#variable "dns_rg" {}
#variable "zone_name" {}
variable "dns_a_records" {
  type = map(string)
}
#variable "dns_cname_record" {
 # type = map(string)
#}
variable "dns_rg" {
 # default = "dns-zones"
}
variable "zone_name" {
#  default = "tdebusiness.cloud"
}
