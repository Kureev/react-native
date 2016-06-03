/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */
'use strict';

const Config = require('./util/Config');
const rnpm = require('./rnpm/core/src/config');

export type Command = {
  name: string,
  description?: string,
  usage?: string,
  func: (argv: Array<string>, config: Config, args: Object) => ?Promise,
  options?: Array<{
    command: string,
    description?: string,
    parse?: (val: string) => any,
    default?: (config: Config) => any | any,
  }>,
};

const withRnpmConfig = func => (argv, config, args) => func(rnpm, argv, args);

// For now, define here all commands that need `rnpm` config instead
// of default config. Once `Config` is merged, @Kureev - i think
// we can just move them to `documentedCommands` ;)
const rnpmCommands = [
  require('./rnpm/link/link'),
  require('./rnpm/link/unlink'),
  require('./rnpm/install/install'),
  require('./rnpm/install/uninstall'),
].map(cmd => {
  cmd.func = withRnpmConfig(cmd.func);
  return cmd;
});

const documentedCommands = [
  require('./server/server'),
  require('./runIOS/runIOS'),
  require('./runAndroid/runAndroid'),
  require('./library/library'),
  require('./bundle/bundle'),
  require('./bundle/unbundle'),
  // @todo(mike) start rewriting these files one by one
  // require('./upgrade/upgrade'),
];

// The user should never get here because projects are inited by
// using `react-native-cli` from outside a project directory.
const undocumentedCommands = [
  {
    name: 'init',
    func: () => {
      console.log([
        'Looks like React Native project already exists in the current',
        'folder. Run this command from a different folder or remove node_modules/react-native'
      ].join('\n'));
    },
  },
];

const commands: Array<Command> = [
  ...documentedCommands,
  ...rnpmCommands,
  ...undocumentedCommands,
];

module.exports = commands;
