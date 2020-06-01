variable "environment" {
  description = "Name of environments:"
  default = "Terraform-Solr-Dev"
}
variable "location" {
  description = "Azure region code of this virtual machine"
  default = "eastus"
}
variable "host_name" {
  description = "Please provide hostname for VM"
  default = "amer-east-solr-globalsite-dev"
}
variable "cloudconfig_file" {
  description = "The location of the cloud init configuration file."
  default = "config/solr_setup.sh"
}
variable "resourcegroup" {
  description = "Please enter host-name of the server:"
  default = "amer-east-solr-globalsite-dev-rg"
}
variable "disk_size" {
  default = "50"
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
variable "dns_rg" {
  default = "dns-zones"
}
variable "zone_name" {
  default = "tdebusiness.cloud"
}
