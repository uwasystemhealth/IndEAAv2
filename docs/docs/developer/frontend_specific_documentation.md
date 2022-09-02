# Frontend Documentation

This contains the technical documentation for the frontend.

## Main Libraries to be aware of in Frontend Development

The following libraries are to be aware of as it is extensively used in the frontend development:

- [ReactJS](https://reactjs.org/)
- [NextJS](https://nextjs.org/): a library that handle SSR, and a more opinionated version of React that creates a lot of tooling


### Routing
- [NextJS Routing](https://nextjs.org/docs/basic-features/pages): NextJS handling

### State Management
- [React Context](https://reactjs.org/docs/context.html) (built-in to React) that allows passing data without having a component tree

???+ info "Authentication"
    To be added, an Authentication Provider will be created to handle the authentication of the user.
### Component System and Design
- [Material UI v5](https://mui.com/): React library that is inline with [Google Material Design](https://material.io/design)

???+ info "SSR with Material UI"
    Note, while NextJS is a good framework, it also introduces as some extra issues that we might need to be aware of:

    - [React Hydration Error](https://nextjs.org/docs/messages/react-hydration-error)
    - [MUI Server-side Rendering](https://mui.com/material-ui/guides/server-rendering/)

### API Integration
- [Axios](https://github.com/axios/axios): used for making HTTP requests to the backend
- [React-SWR](https://swr.vercel.app/) (Stale While Revalidate): uses Axios to make HTTP requests to the backend and caches the response in a concise way by abstracting the usual hooks and state management

### Form Handling
- [Formik](https://formik.org/): library to handle usual form states
- [Yup](https://github.com/jquense/yup): library to handle **usual** form validation

???+ example "Example of Using Material UI, Formik and Yup together"
    Most often you will like to use Material UI to create a good looking form input, while using formik to handle state management and Yup with form validation. Refer to documentation for [example](https://formik.org/docs/examples/with-material-ui)

## Developer Workflow and Settings

### Vscode
If you're using vscode, add the following configuration in `.vscode/settings.json`:

```json
    "[javascript]": {
        "editor.formatOnSave": true,
        "editor.defaultFormatter": "esbenp.prettier-vscode"
    },
    "typescript.tsdk": "frontend/node_modules/typescript/lib"
```

### TypeScript
Initial typescript conversion has left a lot of *.ts/*.tsx files with warnings and errors that were suppressed using the `@ts-ignore` directive. This was mainly due to the fact the Material Dashboard was written in JavaScript and was not ported to TypeScript or no types or interfaces were provided during the initial setup process. This must be solved as soon as possible to avoid further issues and to gain from the benefits of TypeScript.
