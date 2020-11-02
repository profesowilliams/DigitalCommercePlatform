# Quick Setup AEM development (local)

- Clone the repo `git clone https://dev.azure.com/techdatacorp/WW%20Digital%20Commerce/_git/DigitalCommercePlatform`
- Go the the folder of the cloned repo `cd DigitalCommercePlatform`
- Checkout the develop branch `git checkout develop`
- Test your maven setup `mvn help:effective-settings` if you dont see a `SUCCESS` message please check you maven setup
- cd into the `content/digital-platform` folder
- Please ensure your aem author instance is running, if it's not please start it now before you proceed
- Run `mvn -PautoInstallSinglePackage clean install` to build and deploy the entire project to AEM, if you don't see all `SUCCESS` message please stop review you steps/install before procceding
- Navigate to the sites console [http://localhost:4502/sites.html/content](http://localhost:4502/sites.html/content) you should see Digital Platform as a new site 
- AEM development setup complete 
