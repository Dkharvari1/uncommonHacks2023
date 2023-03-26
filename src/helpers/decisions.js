import SpotifyWebApi from "spotify-web-api-js";
//function below this point
/**
 * Args: mood, an array of songs
 * Returns: an array of songs that will be the * playlist
 */

const SPOTIFY_ACCESS_TOKEN = "BQBmkL4mrK4Z2OeXxLePrVuQ-FT9zbTYe7bva3csNNsGxE29E3buZAtIQyqRrEXXdWOl4dtBlbuu_eDkp3W9Edygl0j_KYRilb1JTEx_VHrtPG3ayP_LO_QH7RgeDmu3WgcmDQm5xvO4GEWcFwLerTI1WW3cvhS8_3oJ6U-bS1GlILQQPg"
const SPOTIFY_API = new SpotifyWebApi();
SPOTIFY_API.setAccessToken(SPOTIFY_ACCESS_TOKEN);

export async function makeDecision(mood) {
  let allTracks = await getTracksFromFeaturedPlaylists();
  const trackIDs = allTracks.map(track => track.id);
  console.log("trackIDs", trackIDs);

  const IDs = await getSongBasedOnMood(mood, trackIDs.slice(0, 100).join());
  console.log("***", IDs);

  return (await SPOTIFY_API.getTracks(IDs)).tracks;
}

async function getSongBasedOnMood(mood, trackIDs) {
  const features = await SPOTIFY_API.getAudioFeaturesForTracks(trackIDs);
  console.log("*features", features);

  // mood = "happy";
  const matchedTracks = features.audio_features.map(feature => {
    const { valence, energy, danceability } = feature;
    console.log(feature);
    if (mood == "angry") {
      if (valence <= 0.4 && energy >= 0.7 && danceability <= 0.4) {
        return feature.id;
      }
    } else if (mood == "sad") {
      if (valence <= 0.4 && energy <= 0.4 && danceability <= 0.4) {
        return feature.id;
      }
    } else if (mood == "neutral") {
      if (
        valence <= 0.7 &&
        valence >= 0.4 &&
        energy <= 0.7 &&
        energy >= 0.4 &&
        danceability <= 0.7 &&
        energy >= 0.4
      ) {
        return feature.id;
      }
    } else if (mood == "happy") {
      if (valence >= 0.5 && energy >= 0.5 && danceability >= 0.5) {
        return feature.id;
      }
    } else if (mood == "fearful") {
      if (
        valence >= 0.4 &&
        valence <= 0.7 &&
        energy >= 0.5 &&
        energy <= 0.8 &&
        danceability <= 0.4
      ) {
        return feature.id;
      }
    } else if (mood == "surprised") {
      if (
        valence >= 0.7 &&
        energy >= 0.7 &&
        danceability >= 0.4 &&
        danceability <= 0.7
      ) {
        return feature.id;
      }
    }
  });
  return matchedTracks.filter(e => e);
}

export async function getTracksFromFeaturedPlaylists() {
  const featuredPlaylist = (await SPOTIFY_API.getFeaturedPlaylists()).playlists
    .items;

  const featuredPlaylistIDs = featuredPlaylist.map(playlist => playlist.id);

  const featuredPlaylistTracks = featuredPlaylistIDs.map(async id => {
    const playlistTracks = (await SPOTIFY_API.getPlaylistTracks(id)).items;
    return playlistTracks.map(el => el.track);
  });

  return (await Promise.all(featuredPlaylistTracks)).flat();
}
