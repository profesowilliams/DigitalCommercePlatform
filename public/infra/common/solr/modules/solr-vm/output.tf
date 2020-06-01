output "private_ip_address" {
  value = "${join(", ", azurerm_network_interface.nic.*.private_ip_address)}"
}

