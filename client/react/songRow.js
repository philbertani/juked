import React from 'react'

const PAUSE=0;
const PLAY=1;
const ppIcon = [ 'fa-play-circle','fa-pause'];

const SongRow = (props) => {

  const pd = props.data;
  
  //key to onClick is we need to change the state of a 2 element array
  //so useEffect of parent detects a change
  return (
    <tr>
    <td><i onClick={()=>{ 
          props.setPx( [props.ii, props.px[0]===0?1:0] ) 
        } 
      } className={'fa ' + ppIcon[props.ps[props.ii]] } />
    </td>

    <td><i onClick={()=>{ 
          props.setFF(true)
        }
      } className="fa fa-fast-forward"></i>
    </td>

    <td>{pd.id}</td>
    <td style={{maxWidth:'10vw'}}>{pd.name}</td>
    <td>{props.artist}</td>
    <td>{pd.genre}</td>
    </tr>
  )
}

export default SongRow;
