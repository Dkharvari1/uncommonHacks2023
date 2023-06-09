import React from "react";
import Table from "react-bootstrap/Table";
// import tracks from "../../data/smallerData";
import SongRow from "./SongRow";

const SongCard = ({songs}) => {
  // console.log(tracks);
  return (
    <Table striped bordered style={{background: '#000'}}>
      <thead>
        <tr>
          <th style={{color: '#fff'}}>#</th>
          <th style={{color: '#fff'}}>Title</th>
          <th style={{ color: '#fff' }}>Artist</th>
          <th style={{ color: '#fff' }}>Album</th>
          <th style={{ color: '#fff' }}>Preview</th>
        </tr>
      </thead>
      <tbody>
        {songs.map((song) => (
          <>
          {/* <div>{song.name}</div> */}
            <SongRow song={song} />
          </>
        ))}

        {/* <tr>
          <td><img src={track.album.images[2].url}></img></td>
          <td>{track.name}</td>
          <td>{track.album.artists[0].name}</td>
          <td>{track.album.name}</td>
          <td><iframe src="https://p.scdn.co/mp3-preview/8ed48cfd04dd1c7de4ed5459cafe80e6c5af7735?cid=774b29d4f13844c495f206cafdad9c86" title="description" style={{height: 50, width: 100, borderRadius: 80}}></iframe>
</td>
        </tr> */}
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
          <td>@fat</td>
        </tr>
        <tr>
          <td>3</td>
          <td colSpan={2}>Larry the Bird</td>
          <td>@twitter</td>
        </tr>
      </tbody>
    </Table>
  );

  // return (
  //   <Card style={{ width: '18rem',
  //    marginBottom: '5rem'}}>
  //     <Card.Img variant="top" src={track.album.images[1].url} />
  //     <Card.Body>
  //       <Card.Title>{track.name}</Card.Title>
  //       <Card.Text>
  //         Album: {track.album.name}
  //         <br/>
  //         <br/>
  //         Artist: {track.album.artists[0].name}
  //       </Card.Text>
  //     </Card.Body>
  //     <ListGroup className="list-group-flush">
  //       <ListGroup.Item>Cras justo odio</ListGroup.Item>
  //       <ListGroup.Item>Dapibus ac facilisis in</ListGroup.Item>
  //       <ListGroup.Item>Vestibulum at eros</ListGroup.Item>
  //     </ListGroup>
  //     <Card.Body>
  //       <Card.Link href="#">Card Link</Card.Link>
  //       <Card.Link href="#">Another Link</Card.Link>
  //     </Card.Body>
  //   </Card>

  // );
};

export default SongCard;
