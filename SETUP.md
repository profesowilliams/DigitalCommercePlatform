# Quick Setup AEM development (local)

- Clone the repo `git clone https://dev.azure.com/techdatacorp/WW%20Digital%20Commerce/_git/DigitalCommercePlatform`
- Go to the folder of the cloned repo `cd DigitalCommercePlatform`
- Checkout the develop branch `git checkout develop`
- Test your maven setup `mvn help:effective-settings` if you dont see a `SUCCESS` message please check your maven setup
- cd into the `content/digital-platform` folder
- Please ensure your AEM author instance is running, if it's not please start it now before you proceed
- Run `mvn -PautoInstallSinglePackage clean install` to build and deploy the entire project to AEM, if you see an `ERROR` message(s) on install completion please stop review you steps/install before proceeding
- Navigate to the sites console [http://localhost:4502/sites.html/content](http://localhost:4502/sites.html/content) you should see Digital Platform as a new site
- AEM development setup complete

### VCS Development Workflow (FE)

- Pull the latest branch from develop `git checkout develop`
- Create a new branch `git checkout -b users/network_name/feature/task-name`
- Run `mvn -PautoInstallSinglePackage clean install` to build and deploy to your local AEM instance
- Commit/Push changes to the repo as frequently possible
- When you are complete create and submit a Pull Request to develop branch
- Fix all merge conflicts if there are any
- Set your branch to auto-complete
