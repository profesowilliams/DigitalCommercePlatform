/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 ~ Copyright 2020 Adobe Systems Incorporated
 ~
 ~ Licensed under the Apache License, Version 2.0 (the "License");
 ~ you may not use this file except in compliance with the License.
 ~ You may obtain a copy of the License at
 ~
 ~     http://www.apache.org/licenses/LICENSE-2.0
 ~
 ~ Unless required by applicable law or agreed to in writing, software
 ~ distributed under the License is distributed on an "AS IS" BASIS,
 ~ WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 ~ See the License for the specific language governing permissions and
 ~ limitations under the License.
 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

const path = require('path');

const BUILD_DIR = path.join(__dirname, 'dist');
const CLIENTLIB_DIR = path.join(
  __dirname,
  '..',
  'ui.apps',
  'src',
  'main',
  'content',
  'jcr_root',
  'apps',
  'techdata',
  'clientlibs'
);

const libsBaseConfig = {
  allowProxy: true,
  serializationFormat: 'xml',
  cssProcessor: ['default:none', 'min:none'],
  jsProcessor: ['default:none', 'min:none']
};

// Config for `aem-clientlib-generator`
module.exports = {
  context: BUILD_DIR,
  clientLibRoot: CLIENTLIB_DIR,
  libs: [
    {
      ...libsBaseConfig,
      name: 'clientlib-dependencies',
      categories: ['techdata.dependencies'],
      dependencies:['techdata.grid', 'techdata.scene7.dynamicmedia'],
      assets: {
        // Copy entrypoint scripts and stylesheets into the respective ClientLib
        // directories
        js: {
          cwd: 'clientlib-dependencies',
          files: ['**/*.js'],
          flatten: false
        },
        css: {
          cwd: 'clientlib-dependencies',
          files: ['**/*.css'],
          flatten: false
        }
      }
    },
    {
      ...libsBaseConfig,
      name: 'clientlib-site-global',
      categories: ['techdata.site.global'],
      dependencies: ['techdata.dependencies'],
      embed: ['core.wcm.components.accordion.v1','core.wcm.components.tabs.v1','core.wcm.components.carousel.v1',
      'core.wcm.components.image.v2','core.wcm.components.breadcrumb.v2','core.wcm.components.search.v1',
      'core.wcm.components.form.text.v2','core.wcm.components.pdfviewer.v1','core.wcm.components.commons.datalayer.v1',
      'techdata.grid'],
      assets: {
        // Copy entrypoint scripts and stylesheets into the respective ClientLib
        // directories
        js: {
          cwd: 'clientlib-site-global',
          files: ['**/*.js'],
          flatten: false
        },
        css: {
          cwd: 'clientlib-site-global/css',
          files: ['**/*.css'],
          flatten: false
        },

        // Copy all other files into the `resources` ClientLib directory
        resources: {
          cwd: 'clientlib-site-global/resources',
          files: ['**/*.*'],
          flatten: false,
          ignore: ['**/*.js', '**/*.css']
        }
      }
    },
    {
      ...libsBaseConfig,
      name: 'clientlib-site-us',
      categories: ['techdata.site.us'],
      dependencies: ['techdata.dependencies', 'techdata.site.global'],
      assets: {
        // Copy entrypoint scripts and stylesheets into the respective ClientLib
        // directories
        js: {
          cwd: 'clientlib-site-us',
          files: ['**/*.js'],
          flatten: false
        },
        css: {
          cwd: 'clientlib-site-us/css',
          files: ['**/*.css'],
          flatten: false
        },

        // Copy all other files into the `resources` ClientLib directory
        resources: {
          cwd: 'clientlib-site-us/resources',
          files: ['**/*.*'],
          flatten: false,
          ignore: ['**/*.js', '**/*.css']
        }
      }
    }
  ]
};
