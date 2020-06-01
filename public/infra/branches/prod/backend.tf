terraform {
  backend "azurerm" {
    resource_group_name  = "devops-storage-rg"
    storage_account_name = "tddevops"
    container_name       = "terraform-statefiles"
    key                  = "globalsite-prod-aem.tfstate"
  }
}

provider "azurerm" {
  version         = "=1.44.0"
  subscription_id = "34ddf0af-f62b-4051-8c42-c3cbc3c3db5e"
}
