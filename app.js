'use strict';

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rp = require('request-promise');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const PORT = process.env.PORT;
const CLIENT_ID  = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const RSA_PRIVATE_KEY = fs.readFileSync('./private.key');
const RSA_PUBLIC_KEY = fs.readFileSync('./public.key');

let accessToken, refreshToken;
const scopes = 'user-modify-playback-state';
const router = require('./mock-router');
const Playback = require('./playback-controller');
const playback = new Playback();

const app = express();
app.use(cors());
app.use(helmet());

app.use('/mocks', router);

app.get('/getAuthorization', (req, res) => {
  const spotifyAuthorizeUrl =
    `${getBaseUrl('accounts')}/authorize` +
    `?response_type=code&client_id=${process.env.CLIENT_ID}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent('http://localhost:8080/authorized')}`;

  res.redirect(spotifyAuthorizeUrl);
});

app.get('/authorized', (req, res) => {
  if(req.query.error){
    res.redirect('http://localhost:4200/500');
  }
  else {
    const code = req.query.code;
    const options = {
      method: 'POST',
      uri: `${getBaseUrl('accounts')}/api/token`,
      form: {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: 'http://localhost:8080/authorized',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
      },
      json: true
    };
    rp(options)
      .then(spotifyRes => {
        if(spotifyRes.token_type === 'Bearer' && spotifyRes.scope === scopes){
          accessToken = spotifyRes.access_token;
          const expiresIn = spotifyRes.expires_in;
          refreshToken = spotifyRes.refresh_token;
          const jwtBearerToken = jwt.sign({}, RSA_PRIVATE_KEY, {
            algorithm: 'RS256',
            expiresIn: expiresIn,
            subject: JSON.stringify({
              accessToken: accessToken,
              refreshToken: refreshToken
            })
          });
          res.redirect(`http://localhost:4200/authenticated/${jwtBearerToken}`);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
});

app.get('/next', (req, res) => {
  const options = {
    method:'POST',
    uri: `${getBaseUrl('api')}/v1/me/player/next`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  };
  rp(options)
    .then(response => {
      console.log('response', response);
    })
    .catch(error => {
      console.error(error.error);
    });
});

app.get('/play', (req, res) => {
  const options = {
    method: 'PUT',
    uri: `${getBaseUrl('api')}/v1/me/player/play`,
    body: JSON.stringify({
      uris: [
        'spotify:track:4iV5W9uYEdYUVa79Axb7Rh',
        'spotify:track:1301WleyT98MSxVHPZCA6M'
      ]
    }),
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    json: true
  };
  rp(options)
    .then(response => {
      console.log('response', response);
    })
    .catch(error => {
      console.error(error.error);
    });
});

app.get('/refresh', (req, res) => {
  refreshAccessToken(res);
});

app.get('/getPlayback', (req, res) => {
  res.json(playback.getList());
});

app.get('/search', (req, res) => {
  const searchCriteria = req.query.query;
  const searchType = req.query.type;
  const options = {
    method: 'GET',
    uri: `${getBaseUrl('api')}/v1/search`+
    `?q=${searchCriteria}`+
    `&type=${searchType}&`+
    `market=US`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    json: true
  };
  rp(options)
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      console.error(error.error);
    });
});

app.get('/searchAlbum', (req, res) => {
  const searchCriteria = req.query.query;
  const options = {
    method: 'GET',
    uri: `${getBaseUrl('api')}/v1/search`+
    `?q=${searchCriteria}`+
    `&type=album&`+
    `market=US`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    json: true
  };
  rp(options)
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      console.error(error.error);
    });
});

app.get('/getTracks', (req, res) => {
  const id = req.query.albumId;
  const options = {
    method: 'GET',
    uri: `${getBaseUrl('api')}/v1/albums/${id}/tracks`+
    `?type=album&`+
    `market=US`,
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    json: true
  };
  rp(options)
    .then(response => {
      res.json(response);
    })
    .catch(error => {
      console.error(error.error);
    });
});

const refreshAccessToken = (res) => {
  const options = {
    method: 'POST',
    uri: `${getBaseUrl('accounts')}/api/token`,
    form: {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET
    },
    json: true
  };
  rp(options)
    .then(response => {
      accessToken = response.access_token;
      refreshToken = response.refresh_token;
      res.json(response);
    })
    .catch(error => {
      console.error(error.error);
    })
}

const getBaseUrl = (prefix) => {
  let url = `https://${prefix}.spotify.com`;
  if(process.env.USE_MOCK === 'true'){
    url = 'http://localhost:8080/mocks';
  }
  return url;
};

const server = app.listen(PORT, function () {

  const host = server.address().address;
  const port = server.address().port;

  console.log('\n  listening at http://%s:%s', host, port);

});

module.exports = app;
