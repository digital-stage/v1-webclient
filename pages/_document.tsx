import Document, {
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript
} from 'next/document';
import React from 'react';
import { InitializeColorMode } from 'theme-ui';

interface DocProps extends DocumentProps {
  stylesheets: any;
}

class MyDocument extends Document<DocProps> {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Poppins:ital,wght@0,600;1,600&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <InitializeColorMode />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
