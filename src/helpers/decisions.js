import Spotify from "spotify-web-api-js";
import { tracks } from "../data/test-data";

let song_sample = tracks.slice(0, 10);

//function below this point
/**
 * Args: mood, an array of songs
 * Returns: an array of songs that will be the * playlist
 */

export function makeDecision(mood) {
  var spot = new Spotify();
  spot.setAccessToken(
    "BQD-s_K5Pl4IeTC2QQWTRASqDxKfs1N3EBpiSYXQ5O6zuhGkYak0fUD5gYN8f-UlbLx6huHzZrVyCnjhDyEFN_1f1dsll3EYHxmvetNCacpNw_Xs34m2nD7HSckzeIpv_4taSgdZfAbkNPHb3GVjGvnkJ8MjUfEZ237wOO0PCQW0fj9-ZCAHNr41uxJZyVUkhNjq"
  );
  let selected_songs = song_sample.map(async song => {
    const uriRaw = song.uri;
    const uri = uriRaw.split(":").slice(-1).join();
    const features = await spot.getAudioFeaturesForTrack(uri);
    const valence = features.valence;
    const energy = features.energy;
    const danceability = features.danceability;

    if (mood == "angry") {
      if (valence <= 0.4 && energy >= 0.7 && danceability <= 0.4) {
        return song;
      }
    } else if (mood == "sad") {
      if (valence <= 0.4 && energy <= 0.4 && danceability <= 0.4) {
        return song;
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
        return song;
      }
    } else if (mood == "happy") {
      if (valence >= 0.7 && energy >= 0.7 && danceability >= 0.7) {
        return song;
      }
    } else if (mood == "fearful") {
      if (
        valence >= 0.4 &&
        valence <= 0.7 &&
        energy >= 0.5 &&
        energy <= 0.8 &&
        danceability <= 0.4
      ) {
        return song;
      }
    } else if (mood == "surprised") {
      if (
        valence >= 0.7 &&
        energy >= 0.7 &&
        danceability >= 0.4 &&
        danceability <= 0.7
      ) {
        return song;
      }
    }
  });
  return selected_songs;
}
