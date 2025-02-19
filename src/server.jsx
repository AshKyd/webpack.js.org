// Import External Dependencies
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StaticRouter, Route } from 'react-router-dom';

// Import Utilities
import { getPageTitle } from './utilities/content-utils';

// Import Components
import Site from './components/Site/Site';
import PrintScript from './components/Print/PrintScript';

// Import Images
import Favicon from './favicon.ico';
import Logo from './assets/logo-on-white-bg.svg';

// Define bundles (previously used `Object.values(locals.assets)`) but
// can't retrieve from there anymore due to separate compilation.
const bundles = [
  '/vendor.bundle.js',
  '/index.bundle.js'
];

// As github pages uses trailing slash, we need to provide it to canonicals for consistency
// between canonical href and final url served by github pages.
function enforceTrailingSlash (url) {
  return url.replace(/\/?$/, '/');
}

function isPrintPage(url) {
  return url.includes('/printable');
}

// Export method for `SSGPlugin`
export default locals => {
  let { assets } = locals.webpackStats.compilation;
  let title = getPageTitle(locals.content, locals.path);
  let description = 'webpack is a module bundler. Its main purpose is to bundle JavaScript files for usage in a browser, yet it is also capable of transforming, bundling, or packaging just about any resource or asset.';

  const renderedHtml = ReactDOMServer.renderToString(
    <StaticRouter location={locals.path} context={{}}>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="theme-color" content="#2B3A42" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          { isPrintPage(locals.path) ? <meta name="robots" content="noindex,nofollow" /> : null }
          <title>{title}</title>
          <meta name="description" content={ description } />
          <meta property="og:site_name" content="webpack" />
          <meta property="og:type" content="website" />
          <meta property="og:title" content={ title } />
          <meta property="og:description" name="description" content={ description } />
          <meta property="og:image" content={ Logo } />
          <meta property="twitter:card" content="summary" />
          <meta property="twitter:site" content="@webpack" />
          <meta property="twitter:creator" content="@webpack" />
          <meta property="twitter:domain" content="https://webpack.js.org/" />
          <link rel="icon" type="image/x-icon" href={ Favicon } />
          { Object.keys(assets).filter(asset => /\.css$/.test(asset)).map(path => (
            <link key={ path } rel="stylesheet" href={ `/${path}` } />
          ))}
          <link rel="manifest" href="/manifest.json" />
          <link rel="canonical" href={`https://webpack.js.org${enforceTrailingSlash(locals.path)}`} />
          <link rel="apple-touch-icon" href="/images/icons/icon-192x192.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/images/icons/icon-152x152.png" />
          <link rel="icon" sizes="192x192" href="/images/icons/icon-192x192.png" />
        </head>
        <body>
          <div id="root">
            <Route
              path="/"
              render={ props => (
                <Site
                  { ...props }
                  import={ path => require(`./content/${path}`) } />
              )} />
          </div>
          {
            (isPrintPage(locals.path))
              ? <PrintScript />
              : bundles.map(path => <script key={ path } src={ path } />)
          }
        </body>
      </html>
    </StaticRouter>
  );

  return '<!DOCTYPE html>' + renderedHtml;
};
