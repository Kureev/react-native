/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

const glob = require('glob');
const path = require('path');

const findAssetsInFolder = (folder) =>
  glob.sync(path.join(folder, '**'), { nodir: true });

/**
 * Given an array of asset folders, e.g. ['Fonts', 'Images'],
 * it globs them to find all files that can be copied.
 *
 * It returns an array of absolute paths to files found.
 */
module.exports = function findAssets(base, folders) {
  const concatAssets = (files, folder) =>
    files.concat(findAssetsInFolder(folder));

  return (folders || [])
    .map(folder => path.join(base, folder))
    .reduce(concatAssets, []);
};
