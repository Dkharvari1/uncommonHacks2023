import Spotify from "spotify-web-api-js";
import tracks from '../data/test-data';


song_sample = tracks.slice(0,3);


//function below this point
/**
 * Args: mood, an array of songs
 * Returns: an array of songs that will be the * playlist
 */

var spot = new Spotify();
song_sample.map((song) => {

    const uriRaw = song.uri;
    const uri = uriRaw.split(":").slice(-1).join();
    const features = spot.getAudioFeatures(uri);
  const valence = features.valence;
  const energy = features.energy;
  const danceability = features.danceability;

  if (mood == "angry") {
    if (valence <= 0.4 && energy >= 0.7 && danceability <= 0.4) {
      selected_songs.append(song);
    }
  } else if (mood == "sad") {
    if (valence <= 0.4 && energy <= 0.4 && danceability <= 0.4) {
      selected_songs.append(song);
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
      selected_songs.append(song);
    }
  } else if (mood == "happy") {
    if (valence >= 0.7 && energy >= 0.7 && danceability >= 0.7) {
      selected_songs.append(song);
    }
  } else if (mood == "fearful") {
    if (
      valence >= 0.4 &&
      valence <= 0.7 &&
      energy >= 0.5 &&
      energy <= 0.8 &&
      danceability <= 0.4
    ) {
      selected_songs.append(song);
    }
  } else if (mood == "surprised") {
    if (
      valence >= 0.7 &&
      energy >= 0.7 &&
      danceability >= 0.4 &&
      danceability <= 0.7
    ) {
      selected_songs.append(song);
    }
  }
});
