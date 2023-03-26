import React from "react";

const SongRow = (props) => {
  // const track = props.song;
  // console.log(track);

  return (
    <tr>
      <td>
        <img src={props.song.album.images[2].url}></img>
      </td>
      <td>{props.song.name}</td>
      <td>{props.song.album.artists[0].name}</td>
      <td>{props.song.album.name}</td>
      <td>
        <iframe
          src="https://p.scdn.co/mp3-preview/8ed48cfd04dd1c7de4ed5459cafe80e6c5af7735?cid=774b29d4f13844c495f206cafdad9c86"
          title="description"
          style={{ height: 50, width: 100, borderRadius: 80 }}
        ></iframe>
      </td>
    </tr>
  );
};

export default SongRow;
