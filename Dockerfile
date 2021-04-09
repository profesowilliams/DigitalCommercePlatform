FROM techdata.azurecr.io/dc-aem:latest
COPY content/digital-platform/ui.apps/target/digital-platform.ui.apps-0.0.1-SNAPSHOT.zip  /aem/crx-quickstart/install/
COPY content/digital-platform/ui.content/target/digital-platform.ui.content-0.0.1-SNAPSHOT.zip  /aem/crx-quickstart/install/
COPY content/digital-platform/core/target/digital-platform.core-0.0.1-SNAPSHOT.jar /aem/crx-quickstart/install/
