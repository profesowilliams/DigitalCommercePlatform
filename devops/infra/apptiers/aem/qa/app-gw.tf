
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
  source = "../common/modules/app-gw"

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
      backend_ip_addresses      = ["172.23.132.20"]
    }
  ]

  ssl_certificates = [
    {
      name      = local.cert_tdebusiness_name
      file_path = "../common/script/certs/tdebusiness.cloud.cert.pfx"
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

