terraform {
  backend "azurerm" {
    resource_group_name  = "devops-storage-rg"
    storage_account_name = "tddevops"
    container_name       = "terraform-statefiles"
    key                  = "globalsite-uat-aem.tfstate"
  }
}

provider "azurerm" {
  version         = "=1.44.0"
  subscription_id = "a2e49ea6-c2dc-46ff-b444-90ef2ddf6d9d"
}
