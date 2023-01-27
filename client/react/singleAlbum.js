import React from "react";
import Album from "./album";
import SongRow from "./songRow";
import Canvas from "./Canvas";

const PAUSE = 0;
const PLAY = 1;

//ok here is the deal - we CAN NOT connect an mp3 audio source
//that is non local to the Audio Context directly from browser
//without CORS working on both browser and server so in this
//case we are screwed because the source for juke music does
//not deal with Access-Control-Allow_origin so we are stuck
//with a couple of mp3 files in public for now - the rest from
//the original juke source

//this whole thing resets after going back to all albums and choosing an album again

const singleAlbum = (props) => {

  //utilize useRef when we need to create a DOM element
  //ourselves and keep track of it (Audio and Canvas)
  const newAudioRef = React.useRef(new Audio())
  const newAudio2Ref = React.useRef(new Audio())
  const targetRef = React.useRef(null)

  let SongVisualizer = props.av;
  //console.log("av is: ", SongVisualizer);

  const Songs = props.data.songs;

  const ref = React.useRef();
  //useRef can persist a state without causing re-rendering
  //it is also needed to be able to keep track of DOM components
  //when we need direct access to them

  //song sequence # to play, need to have 2 elements because the first may stay
  //the same and the second one is a toggle
  const [px, setPx] = React.useState([-1, 0]); //song id, play/pause toggle
  const [ps, setPs] = React.useState([]);  //play state array
  const [audioId, setAudioId] = React.useState(-1);
  const [ff,setFF] = React.useState(false)

  const [canvasDim, setCanvas] = React.useState({});
  const [windowSize, setWindowSize] = React.useState({});
  const [playRate, setPlayRate] = React.useState(1)
  const [timeScale, setTimeScale] = React.useState(1)
  const [offset, setOffset] = React.useState(0)

  //music data type:  time or frequency
  const [dataType, setDataType] = React.useState(0)

  React.useEffect(() => {
    const canvasDim = document.getElementById("visualizer");
    setCanvas(canvasDim.getBoundingClientRect());
  }, [windowSize]);

  //this will fire every time window size changes
  React.useEffect(() => {
    window.addEventListener("resize", () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    });
  }, []);

  React.useEffect(() => {
    //console.log("in use effect");
    const oldPs = [...ps];
    ps.length = 0;
    let playing = false;

    const newAudio = newAudioRef.current
    const newAudio2 = newAudio2Ref.current
    
    for (let i = 0; i < Songs.length; i++) {
      const newState =
        i === px[0] ? (oldPs[i] === PAUSE ? PLAY : PAUSE) : PAUSE;

      if (newState === PLAY) {
        if (i !== audioId) {
          setDataType(0)
          setTimeScale(1)
          SongVisualizer.canVisualize = false
          if (Songs[i].localNoCors) {
            console.log("yeah we have this in /public and can analyze it");
            SongVisualizer.canVisualize = true
            newAudio2.pause();
            targetRef.current = newAudio;
            SongVisualizer.changeAudio(targetRef.current);
            SongVisualizer.play = true;
  
          } else {
            newAudio.pause();
            SongVisualizer.play = false;
            targetRef.current = newAudio2;

          }

          targetRef.current.src = Songs[i].audioUrl
          targetRef.current.load()
          targetRef.current.play()

          setAudioId(i);

        } else if (i === audioId ) {
          //if it is already the currently loaded song
          //then unpause it instead of reloading  it
          console.log("unpausing");
          targetRef.current.play()
          SongVisualizer.play = true
        }
        playing = true;
      }
      setPs((x) => [...x, newState]);
    }

    //if (!playing && targetAudio) {
    if (!playing && targetRef.current) {
      //if we get through the whole loop of songs without hitting
      //a PLAY then everything must be paused
      targetRef.current.pause()

      SongVisualizer.play = false; //so we know to use the last good non Zero data
                                   //so we can display something interesting other than a flat line

    }

  }, [px]); //this whole thing is called whenever we click on a song due to
  //setting px which is [songId, toggle], needed to include both
  //songId and toggle to get the state to change properly

  React.useEffect( ()=>{
    if (targetRef.current) {
      targetRef.current.playbackRate = playRate
      //targetRef.current.play()
    }
  }, [playRate, px])

  React.useEffect(()=>{
    if ( ff ) {  //fast forward
      if ( targetRef.current ) {
        targetRef.current.currentTime += 5
      }
      setFF(false)
    }
    //maybe if we are paused then play to get the data points
    //don't display them, then pause and show the latest
  }, [ff])

  return [
    //with this structure we need to return an array of sub elements

    <div key="singleAlbum" style={{ position: "fixed" }} className="row">
      <Album key={props.data.id} data={props.data} />

      <div key="xxx" ref={ref} id="visualizer">
        <Canvas dt={Number(dataType)}
                ts={timeScale}
                av={SongVisualizer}
                off={offset}
                canvasdim={canvasDim} />
        <input
          onChange={(ev)=>{setPlayRate(ev.target.value)}}
          type="range"
          min=".1"
          max="2"
          step=".005"
          value={playRate}
          className="slider"
          id="audioRate"
        ></input>

        <input
          onChange={(ev)=>{setTimeScale(ev.target.value)}}
          type="range"
          min=".06"
          max="1"
          step=".01"
          value={timeScale}
          className="slider"
          id="timeScale"
        ></input>

        <input
          onChange={(ev)=>{setDataType(ev.target.value)}}
          type="range"
          min="0"
          max="1"
          step="1"
          value={dataType}
          className="slider"
          id="dataType"
        ></input>

{/*         <input
          onChange={(ev)=>{setOffset(ev.target.value)}}
          type="range"
          min="0"
          max="500"
          step="1"
          value={offset}
          className="slider"
          id="dataType"
        ></input> */}

      </div>

    </div>,

    <div key="sliderInfo" style={{marginTop:'220px',height:'20px', marginLeft: "260px"}}>
      (Playback Speed, Time or Freq Scale, Time vs Freq)</div>,

    <div key="yyy" style={{ marginTop: "10px" }}>
      <table key={props.data.id + "table"} id="songs">
        <tbody>
          <tr className="gray">
            <td />
            <td />
            <td>#</td>
            <td>Name</td>
            <td>Artist</td>
            <td>Genre</td>
          </tr>

          {Songs.length > 0 &&
            Songs.map((song, ii) => (
              <SongRow
                key={song.id}
                data={song}
                artist={props.data.artist.name}
                ii={ii}
                setPs={setPs}
                setPx={setPx}
                px={px}
                ps={ps}
                setFF={setFF}
              />
            ))}
        </tbody>
      </table>
    </div>,
  ];
};

export default singleAlbum;
