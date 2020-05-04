variable "environment" {
  description = "Name of environments:"
  default = "Terraform-globalsite-dev"
}
variable "host_name" {
  description = "Please provide hostname for VM"
  default = "amer-east-aem-globalsite-dev"
}
variable "resourcegroup" {
  description = "Please enter host-name of the server:"
  default = "amer-east-aem-globalsite-dev-rg"
}
variable "environment-name" {
 default = "amer-east-aem-globalsite-dev"
}
variable "aem-domain-author" {
  default = "us-globalsite-dev-author.s1nextgen.com"
}
variable "aem-domain-publish" {
  default = "us-globalsite-dev.s1nextgen.com"
}
variable "incapsula_dns" {
  default ="test.incaps.dns" 
}
variable "cloudconfig_file" {
  description = "The location of the cloud init configuration file."
  default = "config/aem_setup.sh"
}
variable "cert_s1nextgen_password" {
default = "techdata"
}
variable "zone_id" {
  default = "Z22NHFZIJB63OU"
}
variable "location" {
  description = "Azure region code of this virtual machine"
  default = "eastus"
}
variable "type" {
  default = "CNAME"  
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


#variable "custom_data" {}


#variable "recovery_vault" {
#  description = "Please provide the backup recovery vault name"
#  default = "us-recovery-vault"
#}
#variable "keyvault_name" {
#  description = "Please provide Azure Key vault name"
#  default = "us-tng-vault"
#}
#variable "vault_rg" {
#  description = "Please provide the Recovery vault RG name"
#  default = "us-recovery-vault-rg"
#}
#variable "bkppolicy_name" {
#  description = "Please provide backup policy name"
#  default = "DailyRetain15D"
#}