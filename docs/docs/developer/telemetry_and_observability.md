# Telemetry and Observability
Telemetry and Observability helps us developers to understand how our services are used and to improve our services.

## Tools used in IndEAA

### HotJar (Frontend)
See [hotjar](https://www.hotjar.com/). This tool enables us to see how the user interacts. This is **qualitative** data on the interaction of the user.

In terms of pricing, we don't expect a huge load, so we just stick to "free" pricing. Anything that drops out is not much of our concern.

### Sentry (Frontend + Backend)
Sentry is a tool that allows us developers to receive alerts whenever our app crashes (eg. throwing an exception). This shows us information such as where the crash occurred, the stack trace, environment, payload, as well as some meta information that can give us a full picture as to why certain errors are triggered or make us aware.

See our [sentry organisation](https://sentry.io/organizations/uwa-system-health-lab) to see the errors.

???+ important "Important files and configuration in Sentry:
    The configuration for building frontend is in `frontend/next.config.js`. Note that in `dryRun`, we can configure to not build Sentry as part of the bundle in development mode.

    Here are more configuration files with various purposes:
    - `sentry.properties` - selects the project for the command line of Sentry
    - `sentry.client.config.js` - for client-side rendering
    - `sentry.server.config.js` - for server-side rendering

    Note: For frontend, the source maps are uploaded as part of the build to Sentry. Hence, you need a `SENTRY_AUTH_TOKEN` to perform build. This can be obtained in Sentry API tokens.