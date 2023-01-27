import React from 'react'
import Album from './album'
import SongRow from './songRow'
import Canvas from './Canvas'
import axios from 'axios'
import pbfetch from '../pbfetch'

const PAUSE=0;
const PLAY=1;
const ppIcon = [ 'fa-play-circle','fa-pause'];

//ok here is the deal - we CAN NOT connect an mp3 audio source
//that is non local to the Audio Context directly from browser
//without CORS working on both browser and server so in this
//case we are screwed because the source for juke music does 
//not deal with Access-Control-Allow_origin so we are stuck 
//with a couple of mp3 files in public for now - the rest from
//the original juke source
let newAudio = document.createElement('audio');  //for local audio
let newAudio2 = document.createElement('audio');  //for url audio
let targetAudio;

//we can not simply run getElementById on
//jsx components because they are virtual
//const canvas = document.querySelector('visualizer')

//this whole thing resets after going back to all albums and choosing an album again

const singleAlbum = (props) => {

  let AudioVisualizer = props.av
  console.log('av is: ',AudioVisualizer)
  //AudioVisualizer.changeAudio(newAudio)

  const Songs = props.data.songs;

  const ref = React.useRef()
  //useRef can persist a state without causing re-rendering
  //it is also needed to be able to keep track of DOM components
  //when we need direct access to them

  //song sequence # to play, need to have 2 elements because the first may stay
  //the same and the second one is a toggle
  const [ px,setPx] = React.useState( [-1,0] );
  const [ ps,setPs ] = React.useState([]);
  const [ audioId, setAudioId] = React.useState(-1);

  const [canvas,setCanvas] = React.useState({})
  const [windowSize,setWindowSize ] = React.useState({})

  React.useEffect( ()=>{
    const canvas = document.getElementById('visualizer');
    console.log('use effect: ',canvas.getBoundingClientRect())
    setCanvas(canvas.getBoundingClientRect())
  }, [windowSize])

  //this will fire every time window size changes
  React.useEffect( ()=>{
    window.addEventListener("resize", ()=> {
      setWindowSize({ width:window.innerWidth, height:window.innerHeight})
    })
  } , [])

  //finally we have the actual width of the canvas div
  console.log('windowSize is: ', windowSize)
  console.log('canvas is: ',canvas.width)

  React.useEffect( ()=>{

    const fetchAudioFile = async (url)=>{
      
      //const {data} = await axios.get(url,{
        //responseType: 'arraybuffer',
        //headers: {
          //'Content-Type': 'audio/wav',
          //'Content-Type': 'blob',
          //'Access-Control-Allow-Origin': 'http://127.0.0.1:8080',
          //'withCredentials': 'false'
        //}
      //})

      //const data = await pbfetch(url)

      //console.log('fetched audio:' , data)

    }

    console.log('in use effect')
    const oldPs = [...ps];
    ps.length = 0;
    let playing = false;

    for (let i=0; i<Songs.length; i++) {
        const newState = (i===px[0]) ? (oldPs[i]===PAUSE?PLAY:PAUSE) : PAUSE;

        if ( newState === PLAY ) {

            if ( i !== audioId ) {

              let canVisualize = false;
              if ( Songs[i].localNoCors) {
                console.log('yeah we have this in /public and can analyze it')
                canVisualize = true;
                newAudio2.pause();
                targetAudio = newAudio;
                AudioVisualizer.changeAudio(targetAudio, canVisualize)

              } else {
                newAudio.pause()
                targetAudio = newAudio2;
                //newAudio = document.createElement('audio')
              }
                //we do not have it loaded
                targetAudio.src = Songs[i].audioUrl;
                
                //fetchAudioFile(newAudio.src)

                targetAudio.load();
                targetAudio.play()

                //newAudio.crossOrigin = 'anonymous'  //did not work

                console.dir('trying to play',targetAudio);
                setAudioId(i);
            }
            else if ( i === audioId ) {
                //if it is already the currently loaded song 
                //then unpause it instead of reloading  it
                console.log('unpausing');
                targetAudio.play();
            }
            playing = true;
        }
        setPs( x=>[...x, newState] )
    }

    if ( !playing && targetAudio) {
      //if we get through the whole loop of songs without hitting
      //a PLAY then everything must be paused 
      targetAudio.pause();
    }

  } , [px] );  //this whole thing is called whenever we click on a song due to
               //setting px which is [songId, toggle]

  console.log('ps is:',ps);

  return [  //with this structure we need to return an array of sub elements
    
    <div key='singleAlbum' style={{position:'fixed'}} className='row'>
      <Album key={props.data.id} data={props.data} />

      <div key='xxx' ref={ref} id="visualizer">
        <Canvas />
      </div>
    </div>,

    <div key='yyy' style={{marginTop:'300px'}}>
    <table key={props.data.id+'table'} id='songs'>
    <tbody>
      <tr className='gray'>
        <td />
        <td>#</td>
        <td>Name</td>
        <td>Artist</td>
        <td>Genre</td>
      </tr>

      {Songs.length > 0 &&
        Songs.map( (song,ii) => 
        <SongRow key={song.id} data={song} artist={props.data.artist.name}
         ii={ii} setPs={setPs} setPx={setPx} px={px} ps={ps}/> )
      }

    </tbody>
    </table>
    </div>
  ];
};

export default singleAlbum;
