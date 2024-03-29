/** @type {import('next').NextConfig} */
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    dirs: ['.'], // Run ESLint on all folders within /src. Used by 'yarn lint' command
  },
  // https://nextjs.org/docs/messages/react-hydration-error
  compiler: {
    styledComponents: true,
  },
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
  dryRun: process.env.NODE_ENV !== 'production',
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
