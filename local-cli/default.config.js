/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

var blacklist = require('../packager/blacklist');
var path = require('path');
var findAssets = require('./utils/findAssets');
var ios = require('./ios');
var android = require('./android');

/**
 * Default configuration for the CLI.
 *
 * If you need to override any of this functions do so by defining the file
 * `rn-cli.config.js` on the root of your project with the functions you need
 * to tweak.
 */
var config = {
  getProjectRoots() {
    return getRoots();
  },

  /**
   * Specify where to look for assets that are referenced using
   * `image!<image_name>`. Asset directories for images referenced using
   * `./<image.extension>` don't require any entry in here.
   */
  getAssetRoots() {
    return getRoots();
  },

  /**
   * Returns a regular expression for modules that should be ignored by the
   * packager on a given platform.
   */
  getBlacklistRE(platform) {
    return blacklist(platform);
  },

  /**
   * Returns an rnpm config. If there is no config, returns an empty object
   */
  getRNPMConfig(folder) {
    return getRNPMConfig(folder);
  },

  /**
   * Returns project config from the current working directory
   */
  getProjectConfig() {
    const projectDir = getRoots();
    const cfg = getRNPMConfig(projectDir);

    return Object.assign({}, cfg, {
      ios: ios.projectConfig(projectDir, cfg.ios || {}),
      android: android.projectConfig(projectDir, cfg.android || {}),
      assets: findAssets(projectDir, cfg.assets)
    });
  },

  /**
   * Returns a dependency config from node_modules/<packageName>
   */
  getDependencyConfig(packageName) {
    const dependencyDir = path.join(getRoots(), 'node_modules', packageName);
    const cfg = getRNPMConfig(dependencyDir);

    return Object.assign({}, cfg, {
      ios: ios.dependencyConfig(dependencyDir, cfg.ios || {}),
      android: android.dependencyConfig(dependencyDir, cfg.android || {}),
      assets: findAssets(dependencyDir, cfg.assets)
    });
  }
};

function getRNPMConfig(folder) {
  const packageJSON = path.join(folder, 'package.json');
  return require(packageJSON).rnpm || Object.create(null);
}

function getRoots() {
  if (__dirname.match(/node_modules[\/\\]react-native[\/\\]local-cli$/)) {
    // Packager is running from node_modules.
    // This is the default case for all projects created using 'react-native init'.
    return [path.resolve(__dirname, '../../..')];
  } else if (__dirname.match(/Pods[\/\\]React[\/\\]packager$/)) {
     // React Native was installed using CocoaPods.
    return [path.resolve(__dirname, '../../..')];
  } else {
    return [path.resolve(__dirname, '..')];
  }
}

module.exports = config;
