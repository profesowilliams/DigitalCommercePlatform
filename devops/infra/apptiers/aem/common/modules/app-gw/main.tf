locals {
  frontend_port_name             = lower("${var.host_name}-feport")
  frontend_ip_configuration_name = lower("${var.host_name}-feip")
}
resource "azurerm_public_ip" "public_ip" {
  name                = "${var.host_name}-pip"
  resource_group_name = var.resourcegroup
  location            = var.location
  sku                 = "Standard"
  allocation_method   = "Static"
  depends_on          = [var.resourcegroup]
}

resource "azurerm_application_gateway" "app_gw" {
  name                = "${var.host_name}-appgateway"
  resource_group_name = var.resourcegroup
  location            = var.location
  depends_on          = [var.resourcegroup]

  sku {
    name     = "Standard_v2"
    tier     = "Standard_v2"
    capacity = 2
  }

  gateway_ip_configuration {
    name      = lower("${var.host_name}-ip-configuration")
    subnet_id = var.appgw_subnet_id
  }

  frontend_port {
    name = local.frontend_port_name
    port = 443
  }

  frontend_ip_configuration {
    name                 = local.frontend_ip_configuration_name
    public_ip_address_id = azurerm_public_ip.public_ip.id
  }

  dynamic "backend_http_settings" {
    iterator = setting
    for_each = var.backend_http_settings
    content {
      name                  = setting.value.name
      cookie_based_affinity = "Disabled"
      port                  = setting.value.port
      protocol              = "Http"
      request_timeout       = setting.value.request_timeout
      probe_name            = setting.value.name
    }
  }

  dynamic "backend_address_pool" {
    iterator = pool
    for_each = var.backend_address_pools
    content {
      name         = pool.value.backend_address_pool_name
      ip_addresses = pool.value.backend_ip_addresses
    }
  }

dynamic "probe" {
    iterator = health_probe
    for_each = var.probes
    content {
      interval                                  = 30
      name                                      = health_probe.value.name
      path                                      = health_probe.value.path
      host		                        = health_probe.value.host
      protocol                                  = "Http"
      timeout                                   = 30
      unhealthy_threshold                       = 3
    }
  }
  dynamic "ssl_certificate" {
    iterator = cert
    for_each = var.ssl_certificates
    content {
      name     = cert.value.name
      data     = filebase64(cert.value.file_path)
      password = cert.value.password
    }
  }

  dynamic "http_listener" {
    iterator = listener
    for_each = var.listeners
    content {
      name                           = listener.value.name
      frontend_ip_configuration_name = local.frontend_ip_configuration_name
      frontend_port_name             = local.frontend_port_name
      protocol                       = "Https"
      host_name                      = listener.value.host_name
      ssl_certificate_name           = listener.value.ssl_certificate_name
    }
  }

  dynamic "request_routing_rule" {
    iterator = rule
    for_each = var.routing_rules
    content {
      name                       = rule.value.name
      rule_type                  = "Basic"
      http_listener_name         = rule.value.listener_name
      backend_address_pool_name  = rule.value.backend_pool_name
      backend_http_settings_name = rule.value.backend_http_settings_name
    }
  }

  tags = {
    environment = var.environment
    
  }
}


