
resource "azurerm_resource_group" "resourcegroup" {
     name     = var.resourcegroup
     location = var.location

    tags = {
        environment = var.environment
        
    }
}

module "solr-vm" {
  source = "../../../common/solr/modules/solr-vm"

  host_name           = var.host_name
  location            = var.location
  resourcegroup       = azurerm_resource_group.resourcegroup.name
  subnet_id           = data.azurerm_subnet.subnet_id.id
  virutal_network     = var.virutal_network
  vnet_rg             = var.vnet_rg
  environment         = var.environment
  cloudconfig_file    = "config/solr_setup.sh"
  ssh_key             = "../../../common/solr/script/S1-Root.pub"
  username            = var.username
  vm_private_ips      = "172.23.132.19"
  vm_size             = "Standard_D2s_v3"
  custom_data         = data.template_cloudinit_config.config.rendered
  disk_size           = var.disk_size
  vm_image = {
    publisher = "Canonical"
    offer     = "UbuntuServer"
    sku       = "18.04-LTS"
    version   = "latest"
  }
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

data "azurerm_subnet" "subnet_id" {
  name                 = var.subnet_id
  virtual_network_name = var.virutal_network
  resource_group_name  = var.vnet_rg
}

data "azurerm_resource_group" "vnet_rg" {
  name = var.vnet_rg
}