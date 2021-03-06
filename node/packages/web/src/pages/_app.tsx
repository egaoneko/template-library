import '../styles/globals.css';
import React, { ReactElement, ReactNode, useState } from 'react';
import Head from 'next/head';
import { Provider } from 'mobx-react';
import App from 'next/app';
import { BasePropsType } from '@my-app/core/lib/interfaces/common';
import { IUser } from '@my-app/core/lib/interfaces/user';
import { QueryClient, QueryClientProvider } from 'react-query';
import { NextPage } from 'next';

import { hydrateUser } from 'src/utils/hydrate';
import Notification from 'src/components/atoms/notification/Notification';
import { Stores } from 'src/stores/stores';
import { useUserStore } from 'src/stores/UserStore';

import type { AppContext, AppInitialProps, AppProps } from 'next/app';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

interface PropsType extends BasePropsType, AppPropsWithLayout {
  user: IUser | null;
}

function MyApp({ Component, pageProps }: PropsType): ReactNode {
  const { user, ...props } = pageProps;
  const queryClient = new QueryClient();
  const [stores] = useState<Stores>({
    userStore: useUserStore(user),
  });

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const getLayout = Component.getLayout || (page => page);

  return (
    <>
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="robots" content="index, follow" />
        <meta key="googlebot" name="googlebot" content="index,follow" />
        <meta name="google" content="notranslate" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="keywords" content="nextjs, realworld" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content="next-realworld" />
        <meta property="og:title" content="Next.js realworld example app" />
        <meta property="og:description" content="Next.js" />
        <meta property="og:url" content="https://next-realworld.now.sh/" />
        <meta property="og:image" content="https://next-realworld.now.sh/images/share-link.png" />
        <meta property="twitter:card" content="next-realworld" />
        <meta property="twitter:url" content="https://next-realworld.now.sh/" />
        <meta property="twitter:title" content="Next.js realworld example app" />
        <meta property="twitter:description" content="Next.js" />
        <meta property="twitter:image" content="https://machimban.com/images/talk-link.jpg" />
        <meta name="msapplication-TileColor" content="#000" />
        <meta name="msapplication-TileImage" content="/images/ms-icon-144x144.png" />
        <meta name="theme-color" content="#000" />
        <link rel="apple-touch-icon" sizes="57x57" href="/images/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/images/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/images/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/images/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/images/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/images/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/images/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/images/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/images/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/images/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/images/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/images/favicon-16x16.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: `{
              "@context": "http://schema.org/",
              "@type": "Organization",
              "url": "https://next-realworld.now.sh/",
              "logo": "https://next-realworld.now.sh/images/share-link.png",
              "sameAs": [
                "https://realworld.io",
                "https://medium.com/@ericsimons/introducing-realworld-6016654d36b5",
              ],
            }`,
          }}
        />
        <link rel="manifest" href="/manifest.json" />
      </Head>
      <Provider {...stores}>
        <QueryClientProvider client={queryClient}>
          {getLayout(
            <>
              <Notification />
              <Component {...props} />
            </>,
          )}
        </QueryClientProvider>
      </Provider>
    </>
  );
}

MyApp.getInitialProps = async (appContext: AppContext): Promise<AppInitialProps> => {
  const appProps = await App.getInitialProps(appContext);
  const { ctx } = appContext;

  const user = await hydrateUser(ctx);

  return {
    ...appProps,
    pageProps: {
      pathname: ctx.pathname,
      user,
    },
  };
};

export default MyApp;
