// This is needed to make NextJS SSR work with MUI. Refer to: https://github.com/mui/material-ui/blob/67073cc35a741e9f45aa0d54bc00918a9c05fdb4/examples/nextjs-with-typescript/src/createEmotionCache.ts
import createCache from '@emotion/cache';

const isBrowser = typeof document !== 'undefined';

// On the client side, Create a meta tag at the top of the <head> and set it as insertionPoint.
// This assures that MUI styles are loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
export default function createEmotionCache() {
  let insertionPoint;

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector<HTMLMetaElement>(
      'meta[name="emotion-insertion-point"]',
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  return createCache({ key: 'mui-style', insertionPoint });
}
