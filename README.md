# D2R Reimagined Website

## Start dev web server

    npm start

## Build the app in production mode

    npm run build

It builds all files to docs folder. To deploy to production server, copy all the `docs/*` files to production root folder.

For example

```
docs/index.html
docs/404.html
docs/foo.12345.js
```

Copy to production root folder

```
root_folder/index.html
root_folder/404.html
root_folder/foo.12345.js
```

## Analyze webpack bundle

    npm run analyze
