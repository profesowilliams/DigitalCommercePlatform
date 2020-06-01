#provider "azurerm" {
#  
#    key_vault {
#      purge_soft_delete_on_destroy = true
#    }
#  
#}
resource "azurerm_resource_group" "resourcegroup" {
  name     = var.resourcegroup
  location = var.location
}
data "azurerm_client_config" "current" {}
resource "random_id" "this" {
  keepers = {
    storagename = 1
  }

  byte_length = 6
  prefix      = var.name
}

resource "azurerm_key_vault" "this" {
  name                        = substr(lower(random_id.this.hex), 0, 24)
  location                    = var.location
  resource_group_name         = azurerm_resource_group.resourcegroup.name
  enabled_for_disk_encryption = true
  tenant_id                   = data.azurerm_client_config.current.tenant_id#
#  soft_delete_enabled         = true
#  purge_protection_enabled    = false
  depends_on 		      = [var.resourcegroup]
  sku_name = "standard"

  // The user who provisioned the keyvault.
  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = data.azurerm_client_config.current.object_id

    key_permissions = [
      "Get",
      "List",
      "Update",
      "Create",
      "Import",
      "Delete",
      "Recover",
      "Backup",
      "Restore",
      "Decrypt",
      "Encrypt",
      "UnwrapKey",
      "WrapKey",
      "Verify",
      "Sign",
      "Purge"
    ]
    secret_permissions = [
      "Get",
      "List",
      "Set",
      "Delete",
      "Recover",
      "Backup",
      "Restore",
      "Purge"
    ]
    storage_permissions = [
      "get",
      "list",
      "set"
    ]
    certificate_permissions = [
      "Get",
      "List",
      "Update",
      "Create",
      "Import",
      "Delete",
      "Recover",
      "Backup",
      "Restore",
      "ManageContacts",
      "ManageIssuers",
      "GetIssuers",
      "ListIssuers",
      "SetIssuers",
      "DeleteIssuers",
      "Purge"
    ]
  }

  access_policy {
    tenant_id = data.azurerm_client_config.current.tenant_id
    object_id = "b0cf1cde-e97d-4cc6-aebb-eb899125eeda" // Global_DevOps

    key_permissions = [
      "Get",
      "List",
      "Update",
      "Create",
      "Import",
      "Delete",
      "Recover",
      "Backup",
      "Restore",
      "Decrypt",
      "Encrypt",
      "UnwrapKey",
      "WrapKey",
      "Verify",
      "Sign",
      "Purge"
    ]
    secret_permissions = [
      "Get",
      "List",
      "Set",
      "Delete",
      "Recover",
      "Backup",
      "Restore",
      "Purge"
    ]
    storage_permissions = [
      "get",
      "list",
      "set"
    ]
    certificate_permissions = [
      "Get",
      "List",
      "Update",
      "Create",
      "Import",
      "Delete",
      "Recover",
      "Backup",
      "Restore",
      "ManageContacts",
      "ManageIssuers",
      "GetIssuers",
      "ListIssuers",
      "SetIssuers",
      "DeleteIssuers",
      "Purge"
    ]
  }

  network_acls {
    default_action = "Allow"
    bypass         = "AzureServices"
  }

}