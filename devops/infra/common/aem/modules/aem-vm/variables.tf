variable "host_name" {
  description = "Please enter host-name of the server:"
}
variable "resourcegroup" {
  description = "Please enter host-name of the server:"
}
variable "location" {
 description = "Resource Location"
#  default = "eastus"
}
variable "vm_image" {
  type = object({
    publisher = string
    offer     = string
    sku       = string
    version   = string
  })
}

variable "vm_size" {
  description = "Virtual machine size"
  default = "Standard_D4s_v3"
}
variable "subnet_id" {
  description = "Please enter the Subnet name or ID:"
# default = "Application"
}
variable "virutal_network" {
  description = " Please enter the Virtual Network(Vnet) name or ID associated with the above subnet id:"
#  default = "us-hub-vnet"
}
variable "vnet_rg" {
  description = "Please enter the Virtual Network resource group name:"
#  default = "us-hub-vnet-rg"
}
variable "username" {
  description = "Please enter the username:"
#  default = "ubuntu"
}
variable "ssh_key" {
  description = "Path to the public key to be used for ssh access to the VM"
}
variable "environment" {
 description = "Please provide environment tag for resource:"

}

variable "cloudconfig_file" {
  description = "The location of the cloud init configuration file."
}

variable "vm_private_ips" {
  type = string
  description = "List of static IPs to be assigned"
}
variable "rg_depends_on" {
  type    = any
  default = null
}
variable "custom_data" {}

#variable "recovery_vault" {
#  description = "Please provide the backup recovery vault name"
#  default = "us-recovery-vault"
#}
#variable "vault_rg" {
#  description = "Please provide the Recovery vault RG name"
#  default = "us-recovery-vault-rg"
#}
#variable "bkppolicy_name" {
#  description = "Please provide backup policy name"
#  default = "DailyRetain15D"
#}
#variable "keyvault_name" {
#  description = "Please provide Azure Key vault name"
#  default = "us-tng-vault"
#}
#variable "keyvault_rg" {
#  description = "Please provide Azure Key vault RG name"
#  default = "us-tng-security-rg"
#}