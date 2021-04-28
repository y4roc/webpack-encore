/*
 * This file is part of the Symfony Webpack Encore package.
 *
 * (c) Fabien Potencier <fabien@symfony.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

'use strict';

const expect = require('chai').expect;
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const WebpackConfig = require('../../lib/WebpackConfig');
const RuntimeConfig = require('../../lib/config/RuntimeConfig');
const cleanPluginUtil = require('../../lib/plugins/clean');

function createConfig() {
    const runtimeConfig = new RuntimeConfig();
    runtimeConfig.context = __dirname;
    runtimeConfig.babelRcFileExists = false;

    return new WebpackConfig(runtimeConfig);
}

describe('plugins/clean', () => {
    it('disabled', () => {
        const config = createConfig();
        const plugins = [];

        cleanPluginUtil(plugins, config);
        expect(plugins.length).to.equal(0);
    });

    it('enabled with default settings', () => {
        const config = createConfig();
        const plugins = [];

        config.cleanupOutputBeforeBuild();

        cleanPluginUtil(plugins, config);
        expect(plugins.length).to.equal(1);
        expect(plugins[0].plugin).to.be.instanceof(CleanWebpackPlugin);
        expect(plugins[0].plugin.cleanOnceBeforeBuildPatterns).to.deep.equal(['**/*', '!manifest.json']);
        expect(plugins[0].plugin.dry).to.equal(false);
    });

    it('enabled with custom paths and options callback', () => {
        const config = createConfig();
        const plugins = [];

        config.cleanupOutputBeforeBuild(['**/*.js', '**/*.css'], (options) => {
            options.dry = true;
        });

        cleanPluginUtil(plugins, config);
        expect(plugins.length).to.equal(1);
        expect(plugins[0].plugin).to.be.instanceof(CleanWebpackPlugin);
        expect(plugins[0].plugin.cleanOnceBeforeBuildPatterns).to.deep.equal(['**/*.js', '**/*.css', '!manifest.json']);
        expect(plugins[0].plugin.dry).to.equal(true);
    });

    it('enabled with an options callback that returns an object', () => {
        const config = createConfig();
        const plugins = [];

        config.cleanupOutputBeforeBuild(['**/*.js', '**/*.css'], (options) => {
            options.dry = true;

            // This should override the original config
            return { verbose: true };
        });

        cleanPluginUtil(plugins, config);
        expect(plugins.length).to.equal(1);
        expect(plugins[0].plugin).to.be.instanceof(CleanWebpackPlugin);
        expect(plugins[0].plugin.dry).to.equal(false);
        expect(plugins[0].plugin.verbose).to.equal(true);
    });
});
