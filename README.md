# Spotify Music Player Server

## Development

### Requirements

* Node.js 8.9.4

### Setup
1. Clone repo
```
git clone https://github.com/cameronwolf/spotify-music-player-server.git
```
2. Navigate to the project root:
  ```
  cd spotify-music-player-server
  ```
3. Create a .env file in the root of your cloned repository with the following variables:

   ```
   PORT=number; port to run server on
   CLIENT_ID=[client_id string from Spotify]
   CLIENT_SECRET=[client_secret string from Spotify]
   USE_MOCK=true/false; Defaults to false
   ```
4. Create a public/private RSA keys and save them at the root of the repo, naming them public.key and private.key respectively.
