import Document, {DocumentProps, Head, Html, Main, NextScript} from 'next/document'
import {Provider as StyletronProvider} from 'styletron-react'
import {styletron} from '../styletron'

interface DocProps extends DocumentProps {
    stylesheets: any
}

class MyDocument extends Document<DocProps> {
    static getInitialProps(props) {
        const page = props.renderPage((App) => (props) => (
            <StyletronProvider value={styletron}>
                <App {...props} />
            </StyletronProvider>
        ))
        // @ts-ignore
        const stylesheets = styletron.getStylesheets() || []
        return {...page, stylesheets}
    }

    render() {
        return (
            <Html>
                <Head>
                    {this.props.stylesheets.map((sheet, i) => (
                        <style
                            className="_styletron_hydrate_"
                            dangerouslySetInnerHTML={{__html: sheet.css}}
                            media={sheet.attrs.media}
                            data-hydrate={sheet.attrs['data-hydrate']}
                            key={i}
                        />
                    ))}
                </Head>
                <body>
                <Main/>
                <NextScript/>
                </body>
            </Html>
        )
    }
}

export default MyDocument