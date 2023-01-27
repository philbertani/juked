import React from 'react';

const Album = (props) => {
  //console.log("props:", props);
  if (!props.data) {
    return <h1>Data Loading</h1>;
  } else {
    return (
      <div onClick={()=>{
            if (props.setView) props.setView(props.data.id);
                console.log(props.data.name,' clicked')
            }
        } className="album">
        <a>
          <img src={props.data.artworkUrl} />
          <p>{props.data.name}</p>
          <small>{props.data.artist.name}</small>
        </a>
      </div>
    );
  }
};

export default Album;

