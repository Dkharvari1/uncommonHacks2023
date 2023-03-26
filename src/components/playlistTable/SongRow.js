import React from "react";

const SongRow = ({song}) => {
  const track = song;
  // console.log(track);

  return (
    <>
      <tr>
      <td>
        <img src={track.album.images[2].url}></img>
      </td>
        <td style={{ color: '#fff' }}>{track.name}</td>
        <td style={{ color: '#fff' }}>{track.album.artists[0].name}</td>
        <td style={{ color: '#fff' }}>{track.album.name}</td>
      <td>
        <iframe
          src={track.preview_url}
          title="description"
        ></iframe>
      </td>
    </tr>
    </>
  );
};

export default SongRow;
