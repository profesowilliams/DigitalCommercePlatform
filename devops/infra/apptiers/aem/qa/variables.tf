variable "environment" {
  description = "Name of environments:"
  default = "Terraform-globalsite-qa"
}
variable "host_name" {
  description = "Please provide hostname for VM"
  default = "amer-east-aem-globalsite-qa"
}
variable "resourcegroup" {
  description = "Please enter Resource group name:"
  default = "amer-east-aem-globalsite-qa-rg"
}
variable "environment-name" {
 default = "amer-east-aem-globalsite-qa"
}
variable "aem-domain-author" {
  default = "us-qa-author.tdebusiness.cloud"
}
variable "aem-domain-publish" {
  default = "us-qa.tdebusiness.cloud"
}
variable "incaps_dns" {
  default ="test.incaps.dns" 
}
variable "cloudconfig_file" {
  description = "The location of the cloud init configuration file."
  default = "config/aem_setup.sh"
}
variable "cert_tdebusiness_password" {
default = "techdata"
}
variable "location" {
  description = "Azure region code of this virtual machine"
  default = "eastus"
}
variable "appgw_subnet_id" {
  description = "Please enter the Subnet name or ID:"
  default = "Application-Gateway-V2"
}
variable "virutal_network" {
  description = " Please enter the Virtual Network(Vnet) name or ID associated with the above subnet id:"
  default = "us-hub-vnet"
}
variable "vnet_rg" {
  description = "Please enter the Virtual Network resource group name:"
  default = "us-hub-vnet-rg"
}
variable "subnet_id" {
  description = "Please enter the Subnet name or ID:"
  default = "Application"
}
variable "username" {
  description = "Please enter the username:"
  default = "ubuntu"
}
variable "rg_depends_on" {
  type    = any
  default = null
}
variable "healtcheck_author" {
  default = "/libs/granite/core/content/login.html"
}
variable "healtcheck_publish" {
  default = "/content/we-retail/us/en.html"
}
variable "dns_rg" {
  default = "dns-zones"
}
variable "zone_name" {
  default = "tdebusiness.cloud"
}
