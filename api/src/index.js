import express from 'express'
import cors from 'cors'
import { GITHUB_AUTHORIZE_URL, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, PORT } from './config.js'

const app = express()

app.use(express.json())
app.use(cors())


app.get('/users/me', async (request, response) => {
  const authorizationHeader = request.headers.authorization
  const [tokenType, accessToken] = authorizationHeader.split(' ')

  const userResponse = await fetch('https://discord.com/api/users/@me', {
    headers: {
      authorization: `${tokenType} ${accessToken}`,
    }
  });

  const userData = await userResponse.json();

  const {
    id,
    username,
    avatar,
    email,
    verified,
  } = userData

  const user = { id, username, avatar, email, verified }

  response.json(user)
})


app.get('/auth/discord', (request, response) => {
  response.redirect(GITHUB_AUTHORIZE_URL)
})

app.get('/auth/discord/callback', async (request, response) => {
  const { code } = request.query

  if (!code) {
    return response.redirect('http://localhost:5173/?error=invalid_code')
  }

  try {
    const res = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:4000/auth/discord/callback',
        scope: 'identify email',
      }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    const data = await res.json();
    /*
       {
          access_token: '3o8r5k4fgEvMkvgWdVindeq5kwEaYF',
          expires_in: 604800,
          refresh_token: 'aNij6EWZiW0u8jylpS3L3d3eeAJlBZ',
          scope: 'email identify',
          token_type: 'Bearer'
        }
     */

    const { access_token: accessToken, token_type: tokenType, expires_in: expires } = data;

    if (!accessToken) {
      return response.redirect('http://localhost:5173/?error=invalid_token')
    }

    // const userResponse = await fetch('https://discord.com/api/users/@me', {
    //   headers: {
    //     authorization: `${tokenType} ${accessToken}`,
    //   }
    // });

    // const userData = await userResponse.json();

    // save user data to database

    response.cookie('token', accessToken).redirect('http://localhost:5173/')
  } catch (error) {
    console.error(error)
    response.json({ error })
  }

})

app.listen(PORT, () => {
  console.log(`API is running on http://localhost:${PORT}`)
})