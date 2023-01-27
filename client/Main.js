import React from 'react';
import Album from './react/album';
import SingleAlbum from './react/singleAlbum'
import * as fakeDB from './fakeDB'
import AudioVisualizer from './audio'  //AV - AudioVisualizer

const SongVisualizer = new AudioVisualizer()

const Main = () => {

  const [al,setAl] = React.useState([]);
  const [alId,setAlId] = React.useState(-1); //state -1 means ALL

  React.useEffect( ()=>{
      if ( alId > -1) 
        setAl( [fakeDB.Albums[alId] ] )
      else
        setAl( fakeDB.Albums);
  }, [alId] );  //[] contains al by default

  //console.log('al in react:', al);

  return (
    <div id="main" className="row container">
      <div id="sidebar">
        <img onClick={()=>{setAlId(-1)}} src="./public/juke.svg" id="logo" />
        <section>
          <h4>
            <a onClick={()=>{setAlId(-1)}} >ALBUMS</a>
          </h4>
        </section>
      </div>

      <div className="container">
        { (al.length === 1) ? (
           <div id='single-album' className='column'> 
            <SingleAlbum av={SongVisualizer} key={al[0].id} data={al[0]}/>
           </div>) : (
            al.length > 0 ? (
            <div id="albums" className="row wrap">
              {al.map( obj => 
              <Album key={obj.id} data={obj} setView={setAlId} /> )}
            </div> ) : ( <Album  />)
          ) 
        }
    
      </div>
    </div>
  );
};

export default Main;
