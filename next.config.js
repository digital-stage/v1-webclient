const { nextI18NextRewrites } = require('next-i18next/rewrites')
const localeSubpaths = {}

module.exports = {
    rewrites: async () => nextI18NextRewrites(localeSubpaths),
    webpack: function (config) {
        config.externals = config.externals || {}
        config.externals['styletron-server'] = 'styletron-server'

        return config
    },
    publicRuntimeConfig: {
        localeSubpaths,
    },
}