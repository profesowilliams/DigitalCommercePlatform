resource "azurerm_resource_group" "resourcegroup" {
     name     = var.resourcegroup
     location = var.location

    tags = {
        environment = var.environment
        CCOE        = "eBusiness"
    }
}

module "aem-vm" {
  source = "../../../common/aem/modules/aem-vm"

  host_name           = var.host_name
  location            = var.location
  resourcegroup       = azurerm_resource_group.resourcegroup.name
  subnet_id           = data.azurerm_subnet.subnet_id.id
  virutal_network     = var.virutal_network
  vnet_rg             = var.vnet_rg
  environment         = var.environment
  cloudconfig_file    = "config/aem_setup.sh"
  custom_data         = data.template_cloudinit_config.config.rendered
  backup_policy_id    = data.azurerm_recovery_services_protection_policy_vm.backup_policy.id
  recovery_vault_name = data.azurerm_recovery_services_vault.recovery_vault.name
  ssh_key             = "../../../common/aem/script/S1-Root.pub"
  username            = var.username
  vm_private_ips      = "172.23.132.21"
#  public_ip	      = "azurerm_public_ip.publicip.ip_address"
  vm_size             = "Standard_D2s_v3"
  recovery_vault      = var.recovery_vault
  vault_rg            = var.vault_rg
  bkppolicy_name      = var.bkppolicy_name
  
  vm_image = {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }
}

locals {
  backend_http_settings_author  = lower("${var.host_name}-author")
  backend_http_settings_publish = lower("${var.host_name}-publish")
  backend_address_pool_name     = lower("${var.host_name}")
  listener_author               = lower("${var.host_name}-author")
  listener_publish              = lower("${var.host_name}-publish")
  probe_author                  = lower("${var.host_name}-author")
  probe_publish                 = lower("${var.host_name}-publish")
  routing_rule_author           = lower("${var.host_name}-author")
  routing_rule_publish          = lower("${var.host_name}-publish")
  cert_tdebusiness_name           = "tdebusiness"
}

module "app-gw" {
  source = "../../../common/aem/modules/app-gw"

  location            = var.location
  host_name           = var.host_name
  resourcegroup       = azurerm_resource_group.resourcegroup.name
  appgw_subnet_id     = data.azurerm_subnet.appgw_subnet_id.id
  virutal_network     = var.virutal_network
  vnet_rg             = var.vnet_rg
  environment         = var.environment
  

  backend_http_settings = [
    {
      name            = local.backend_http_settings_author
      port            = 4502
      request_timeout = 120
      probe_name      = local.backend_http_settings_author
    },
    {
      name            = local.backend_http_settings_publish
      port            = 4503
      request_timeout = 120
      probe_name      = local.backend_http_settings_publish
    }
  ]

  backend_address_pools = [

    {
      backend_address_pool_name = local.backend_address_pool_name
      backend_ip_addresses      = ["172.23.132.21"]
    }
  ]

  ssl_certificates = [
    {
      name      = local.cert_tdebusiness_name
      file_path = "../../../common/aem/script/certs/tdebusiness.cloud.cert.pfx"
      password  = var.cert_tdebusiness_password
    }
  ]

  listeners = [
    {
      name                 = local.listener_author
      host_name            = var.aem-domain-author
      ssl_certificate_name = local.cert_tdebusiness_name
    },
    {
      name                 = local.listener_publish
      host_name            = var.aem-domain-publish
      ssl_certificate_name = local.cert_tdebusiness_name
    }
  ]

  probes = [
    {
      name            = local.probe_author
      path            = var.healtcheck_author
      host            = var.aem-domain-author
    },
    {
      name            = local.probe_publish
      path            = var.healtcheck_publish
      host            = var.aem-domain-publish
    }

 #   match  {
 #   		  status_code = ["200-999"]
 #    }
  ]

  routing_rules = [
    {
      name                       = local.routing_rule_author
      listener_name              = local.listener_author
      backend_pool_name          = local.backend_address_pool_name
      backend_http_settings_name = "${local.backend_http_settings_author}"
    },
    {
      name                       = local.routing_rule_publish
      listener_name              = local.listener_publish
      backend_pool_name          = local.backend_address_pool_name
      backend_http_settings_name = "${local.backend_http_settings_publish}"
    }
  ]
}

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



data "azurerm_subnet" "appgw_subnet_id" {
  name                 = var.appgw_subnet_id
  virtual_network_name = var.virutal_network
  resource_group_name  = var.vnet_rg
}
data "azurerm_subnet" "subnet_id" {
  name                 = var.subnet_id
  virtual_network_name = var.virutal_network
  resource_group_name  = var.vnet_rg
}

data "azurerm_resource_group" "vnet_rg" {
  name = var.vnet_rg
}


data "template_file" "cloudconfig" {
  template = file("${var.cloudconfig_file}")
}

data "template_cloudinit_config" "config" {
  gzip          = true
  base64_encode = true

  part {
    filename     = "config/aem_setup.sh"
    content_type = "text/x-shellscript"
    content      = data.template_file.cloudconfig.rendered
  }
}
data "azurerm_recovery_services_vault" "recovery_vault" {
    name                = var.recovery_vault
    resource_group_name = var.vault_rg
}
data "azurerm_recovery_services_protection_policy_vm" "backup_policy" {
  name                = var.bkppolicy_name
  resource_group_name = var.vault_rg
  recovery_vault_name = data.azurerm_recovery_services_vault.recovery_vault.name
}