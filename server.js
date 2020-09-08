const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();

const port = process.env.PORT || 3000;
const gitbookSignKey = process.env.GITBOOK_JWT_KEY
const gitbookSpaceURL = process.env.GITBOOK_URL;

//
// Welcome page to simulate your application.
//
app.get('/', (req, res) => {
    res.send(`
        <p>Click <a href="/auth">here</a> to access the documentation !</p>
    `)
});

//
// Page prompting the authentication of the user on the application side.
// This endpoint is the equivalent of your login page.
//
app.get('/auth', (req, res) => {
    res.send(`
        <p>Click <a href="/auth/confirm?location=${encodeURIComponent(req.query.location || '')}">here</a> to authenticate !</p> 
    `)
});

//
// Redirect to the documentation with the JWT token signed when auth has been "completed".
// The user session on your application should be checked here to validate that the user can access the documentation.
// 
// ==> This endpoint is the fallback URL to configure on GitBook side.
//     GitBook will redirect the visitor to this url when authentication is needed.
//
app.get('/auth/confirm', (req, res) => {
    const token = jwt.sign({}, gitbookSignKey, { expiresIn: '1h' });

    const uri = new URL(`${gitbookSpaceURL}${req.query.location || ''}`);
    uri.searchParams.set('jwt_token', token)

    res.redirect(uri.toString());
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});