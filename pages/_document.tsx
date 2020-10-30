import Document, {
  DocumentProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { Provider as StyletronProvider } from "styletron-react";
import { styletron } from "../styletron";
import { ServerStyleSheets } from "@material-ui/styles";
import React from "react";

interface DocProps extends DocumentProps {
  stylesheets: any;
}

class MyDocument extends Document<DocProps> {
  static async getInitialProps(props) {
    const sheets = new ServerStyleSheets();

    const page = props.renderPage((App) => (props) => {
      return (
        <StyletronProvider value={styletron}>
          {sheets.collect(<App {...props} />)}
        </StyletronProvider>
      );
    });

    const initialProps = await Document.getInitialProps(props);

    // @ts-ignore
    const stylesheets = styletron.getStylesheets() || [];
    return {
      ...page,
      stylesheets,
      styles: [
        ...React.Children.toArray(initialProps.styles),
        sheets.getStyleElement(),
      ],
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
              data-hydrate={sheet.attrs["data-hydrate"]}
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
