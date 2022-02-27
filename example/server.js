import React from 'react'
import ReactDOMServer from 'react-dom/server'
import express from 'express'
import Elem from './Elem.jsx'

const app = express()
const port =  3000;

app.get('/', (req, res) => {
    const jsx = ReactDOMServer.renderToString(<Elem />)

    const clientBundleScript = `<script src="scripts/bundle.js"></script>`

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>My SSR App</title>
            </head>
            <body>
                <div id='ssr-app'>${jsx}</div>
                ${clientBundleScript}
            </body>
        </html>
    `)
})

app.listen(port, () => {
    console.log(`App listening on http://localhost:${port}`)
})
