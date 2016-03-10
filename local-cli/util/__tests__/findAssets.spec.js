/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */
'use strict';

jest.autoMockOff();

const findAssets = require('../findAssets');
const mockFs = require('mock-fs');
const dependencies = require('./fixtures/dependencies');
const isArray = (arg) =>
  Object.prototype.toString.call(arg) === '[object Array]';

describe('findAssets', () => {

  beforeAll(() => mockFs({ testDir: dependencies.withAssets }));

  it('should return an array of all files in given folders', () => {
    const assets = findAssets('testDir', ['fonts', 'images']);

    expect(isArray(assets)).toBeTruthy();
    expect(assets.length).toEqual(3);
  });

  it('should prepend assets paths with the folder path', () => {
    const assets = findAssets('testDir', ['fonts', 'images']);

    assets.forEach(assetPath => expect(assetPath).toContain('testDir'));
  });

  it('should return an empty array if given assets are null', () => {
    expect(findAssets('testDir', null).length).toEqual(0);
  });

  afterAll(mockFs.restore);
});
