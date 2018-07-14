'use strict';
const router = require('express').Router();
const trackRes = require('./track-search-res.json');
const albumRes = require('./album-search-res.json');
const artistRes = require('./artist-search-res.json');
const albumTracks = require('./album-tracks-res.json');

router.get('/authorize', (req, res) => {
  res.redirect('/authorized?code=AQDDV-sBSKUpPOZXBmryKCH7uWpnuKidAq8moHgkf_hAHO6E5c4Bs0AAB6PJ-OLAveQtEQ-n2fGx4WIwk7cuuSIHYNlOTWZ9tELwamEyNuOjw2Db9yuEfsryagzMkw7u6ssr9QsDTMEywyglLDng49_NgRTTUukGwQ0cScbJ8_gRCQzop_2F-cwDIYzPhiTYY98xVYdfTzLkJ-xMx6hKsr3MiXLlWF3ECnxUMw');
});
router.post('/api/token', (req, res) => {
  res.json({
    access_token: 'BQBEYVhJjZXXNuA5irPlpxu3cr9SfDrBU30pR4nLfucPCItwsNlt2iy9ZEDryV-6MZce-7MdLb-Ffq0cpmCleRNaGOYKvktb3T-SZNELMG9H-NlHDfGyOpdG7vjr2rP7OO2vQqSsQFCQIZkACElX_mfHdq9c',
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: 'AQCfrPxVyfdsZaVLUtbAku5QOB0T2FjOxUEr_E1U4KWyz21StBpNnBR9MQR0dC5ESzvd9Sy71ZjzgWhtmtlzkjkBWuMfiHe190swqTF5GJxsJ-iIdPBduLpPR5VNQHm01nA',
    scope: 'user-modify-playback-state'
  });
});
router.post('/v1/me/player/next', (req, res) => {
  res.sendStatus(204);
});
router.post('/v1/me/player/previous', (req, res) => {
  res.sendStatus(204);
});
router.put('/v1/me/player/play', (req, res) => {
  res.sendStatus(204);
});
router.get('/v1/search', (req, res) => {
  const type = req.query.type;
  if(type === 'track'){
    res.json(trackRes);
  }
  else if(type === 'album'){
    res.json(albumRes);
  }
  else if(type === 'artist'){
    res.json(artistRes);
  }
  else {
    res.json({error: 'need to specify type'})
  }
});
router.put('/v1/me/player/volume', (req, res) => {
  res.sendStatus(204);
});
router.get(`/v1/albums/:albumId/tracks`, (req,res) => {
  res.json(albumTracks);
});

module.exports = router;
