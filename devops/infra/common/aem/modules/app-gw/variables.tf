variable "location" {
  description = "Location of this VM"
}

variable "resourcegroup" {
  description = "Resource group name"
}

variable "environment" {
  description = "Name of environment, options: Dev, Acc, Prd, Qa, Demo"
}
variable "host_name" {
  description = "Host Name of the resource"
}

variable "backend_http_settings" {
  description = "List of backend http setttings"
  type = list(object({
    name            = string
    port            = number
    request_timeout = number
    probe_name      = string
  }))
}

variable "backend_address_pools" {
  description = "List of web service backend pool"
  type = list(object({
    backend_address_pool_name = string
    backend_ip_addresses      = list(string)
  }))
}

variable "listeners" {
  description = "List of http listener"
  type = list(object({
    name                 = string
    host_name            = string
    ssl_certificate_name = string
  }))
}
variable "probes" {
  description = "List of probes"
  type = list(object({
    name                 = string
    path                 = string
    host            = string
  }))
}

variable "ssl_certificates" {
  description = "List of HTTPS listener certificates"
  type = list(object({
    name      = string
    file_path = string
    password  = string
  }))
}

variable "routing_rules" {
  description = "List of application gateway routing rules"
  type = list(object({
    name                       = string
    listener_name              = string
    backend_pool_name          = string
    backend_http_settings_name = string
  }))
}

variable "appgw_subnet_id" {
  description = "Please enter the Subnet name or ID:"
#  default = "Application-Gateway-V2"
}
variable "virutal_network" {
  description = " Please enter the Virtual Network(Vnet) name or ID associated with the above subnet id:"
#  default = "us-hub-vnet"
}
variable "vnet_rg" {
  description = "Please enter the Virtual Network resource group name:"
#  default = "us-hub-vnet-rg"
}
variable "rg_depends_on" {
  type    = any
  default = null
}