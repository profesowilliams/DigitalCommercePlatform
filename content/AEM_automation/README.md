# Renewals Automation Suite

The automation suite consists of a bunch of tests cases grouped by features, this can be configured to run against any endpoint, but by the time this was created it was intended to be run against the local development environment. If you want to run it against any other endpoint go to the settings section of this document

## Installation

Before running the suite it must be installed. Please, be aware that if you want to run it agains the local environment this one has to be initialized already.

To install it simply run the following command in the root folder of the automation suite (AEM_automation)

```bash
npm install
```

## How to run

There are two ways of running the suite. If you want to run it as a whole execute this command
```bash
npm run test
```
It will run all the tests and also generate an html report that can be found in the folder `AEM_automation/cypress/report` you can open it using your favorite web browser

The other way to run these tests is by executing the cypress ui, for this run this command

```bash
npx cypress open
```
It will open the cypress ui and from there simply click the feature you want to execute

## How can I run it against a different endpoint

This is very simple, go to the following file `AEM_automation/cypress/e2e/page_objects/renewals_page.js`.
Once there look for the variable `URL` and change it to the desired endpoint.

## Contributing
If you want to create a new test, add it in the `AEM_automation/cypress/e2e/step_definitions` folder, also, the Page Objects which includes locators and methods for the given page, you can find them in `AEM_automation/cypress/e2e/page_objects/`.