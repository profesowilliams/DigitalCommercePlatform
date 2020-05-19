resource "azurerm_virtual_machine" "mainvm" {

  name                  = "${var.host_name}-vm"
  location              = var.location
  resource_group_name   = var.resourcegroup
  network_interface_ids = ["${azurerm_network_interface.nic.id}"]
  vm_size               = var.vm_size
  depends_on            = [var.resourcegroup]

    storage_os_disk {
        name              = "${var.host_name}-osdisk"
        caching           = "ReadWrite"
        create_option     = "FromImage"
        managed_disk_type = "Premium_LRS"
        disk_size_gb      = "50"
    }

    storage_image_reference {
    publisher = var.vm_image.publisher
    offer     = var.vm_image.offer
    sku       = var.vm_image.sku
    version   = var.vm_image.version
    }

    os_profile {
        computer_name  = var.host_name
        admin_username = "ubuntu"
        custom_data = var.custom_data
    }

    os_profile_linux_config {
        disable_password_authentication = true
        ssh_keys {
            path     = "/home/${var.username}/.ssh/authorized_keys"
            key_data = file("${var.ssh_key}")
        }
    }

    tags = {
        environment = var.environment
        
    }
}

resource "azurerm_backup_protected_vm" "vm_policy" {
  resource_group_name = var.vault_rg
  recovery_vault_name = var.recovery_vault_name
  source_vm_id        = azurerm_virtual_machine.mainvm.id
  backup_policy_id    = var.backup_policy_id 
#  lifecycle {
#            prevent_destroy = true
#    }
}

resource "azurerm_network_interface" "nic" {
    name                      = "${var.host_name}-nic"
    location                  = var.location
    resource_group_name       = var.resourcegroup
    network_security_group_id = azurerm_network_security_group.nsg.id
    ip_configuration {
        name                          = "${var.host_name}-ip-config"
        subnet_id                     = var.subnet_id
        private_ip_address_allocation = "Static"
        private_ip_address            = var.vm_private_ips
        public_ip_address_id          = azurerm_public_ip.publicip.ip_address
    }

    tags = {
        environment = "${var.environment}"
    }
}
resource "azurerm_public_ip" "publicip" {
    
    name                         = "${var.host_name}-pip"
    location                     = var.location
    resource_group_name          = var.resourcegroup
    allocation_method            = "Dynamic"

    tags = {
        environment = var.environment
       
    }
}
resource "azurerm_network_security_group" "nsg" {

    name                = "${var.host_name}-nsg"
    location            = var.location
    resource_group_name = var.resourcegroup
    depends_on          = [var.resourcegroup]
    security_rule {
        name                       = "SSH"
        priority                   = 1001
        direction                  = "Inbound"
        access                     = "Allow"
        protocol                   = "Tcp"
        source_port_range          = "*"
        destination_port_range     = "22"
        source_address_prefixes      = ["103.81.79.35","169.153.0.0/17"]
        destination_address_prefix = "*"
    }
    security_rule {
        name                       = "Port_443"
        priority                   = 1002
        direction                  = "Inbound"
        access                     = "Allow"
        protocol                   = "Tcp"
        source_port_range          = "*"
        destination_port_ranges    = ["443","8443","80"]
        source_address_prefixes    = ["199.83.128.0/21","198.143.32.0/19","49.126.72.0/21","103.28.248.0/22","45.64.64.0/22","185.11.124.0/22","192.230.64.0/18","107.154.0.0/16","45.60.0.0/16","45.223.0.0/16"]
        destination_address_prefix = "*"
    }

    tags = {
        environment = var.environment
        
    }
}


