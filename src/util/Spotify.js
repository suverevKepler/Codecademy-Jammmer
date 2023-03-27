let accessToken;
const clientId = '5f6e29f278994204930ec547a3af6418';
const redirectURI = 'http://localhost:3000/';

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      console.log('ACCESS TOKEN YEST');
      return accessToken;
    }
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      console.log(accessTokenMatch);
      const expiresIn = Number(expiresInMatch[1]);
      window.setTimeout(() => (accessToken = ''), expiresIn * 1000);
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
      window.location = accessUrl;
    }
  },
  search(term) {
    const accessToken = Spotify.getAccessToken();
    console.log(accessToken);
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((response) => {
        return response.json();
      })
      .then((jsonResponse) => {
        if (!jsonResponse.tracks) {
          return [];
        }
        const tracks = jsonResponse.tracks.items.map((track) => ({
          id: track.id,
          name: track.name,
          artists: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
        }));
        console.log('ALMOST RETURN');
        return tracks;
      });
  },
  savePlaylist(name, tracksUris) {
    if (name && tracksUris) {
      const accessToken = Spotify.getAccessToken();
      const headers = { Authorization: `Bearer ${accessToken}` };
      let userId;
      return fetch('https://api.spotify.com/v1/me', { headers: headers })
        .then((response) => response.json())
        .then((jsonResponse) => {
          userId = jsonResponse.id;
          return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({ name: name }),
          })
            .then((response) => response.json())
            .then((jsonResponse) => {
              const playlistId = jsonResponse.id;
              return fetch(
                `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks
              `,
                { headers: headers, method: 'POST', body: JSON.stringify({ uris: tracksUris }) }
              );
            });
        });
    } else {
      return;
    }
  },
};

export default Spotify;
