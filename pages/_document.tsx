import Document, {
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from 'next/document';
import { Provider as StyletronProvider } from 'styletron-react';
import React from 'react';
import { styletron } from '../styletron';

interface DocProps extends DocumentProps {
  stylesheets: any;
}

class MyDocument extends Document<DocProps> {
  static async getInitialProps(props) {
    const page = props.renderPage((App) => (appProps) => (
      <StyletronProvider value={styletron}>
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <App {...appProps} />
      </StyletronProvider>
    ));

    // @ts-ignore
    const stylesheets = styletron.getStylesheets() || [];
    return {
      ...page,
      stylesheets,
    };
  }

  render() {
    return (
      <Html>
        <Head>
          {this.props.stylesheets.map((sheet, i) => (
            <style
              className="_styletron_hydrate_"
              dangerouslySetInnerHTML={{ __html: sheet.css }}
              media={sheet.attrs.media}
              data-hydrate={sheet.attrs['data-hydrate']}
              /* eslint-disable-next-line react/no-array-index-key */
              key={i}
            />
          ))}
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Poppins:ital,wght@0,600;1,600&display=swap"
            rel="stylesheet"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
