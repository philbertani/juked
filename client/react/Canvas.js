
import React, { useRef, useEffect } from 'react'

let count = 0
let avg = 0
let totalCount = 0

const Canvas = props => {

  const dataType = props.dt //time or frequency domain
  const timeScale = Math.max(props.dt === 0 ? props.ts : props.ts - .5,.01)
  const SongVisualizer = props.av
  const canvasDim = props.canvasdim
  const offset = props.off

  const canvasRef = useRef(null)
  
  const draw = (ctx, frameCount) => {

    if (SongVisualizer.canVisualize 
        && SongVisualizer.play === true 
        && typeof dataType !== 'undefined') {
      count ++

      let musicData
      if ( dataType === 0 ) {
        musicData = SongVisualizer.getTimeDomainData()
      }
      else if (dataType === 1) {
        musicData = SongVisualizer.getFrequencyData()
      }
      else {
        musicData = []
      }

      const n = Math.trunc(musicData.length * timeScale) //fft bins is half of this

      ctx.canvas.width = canvasDim.width
      ctx.canvas.height = canvasDim.height * .9 //leave room for sliders at bottom
      ctx.clearRect(0, 0, canvasDim.width, canvasDim.height)
      ctx.lineWidth = dataType === 0 ? 1 : 4

      if ( dataType === 1 && props.ts < .5 ) ctx.lineWidth += 15
      else if ( dataType === 0 && props.ts < .2) ctx.lineWidth += 5
      else if ( dataType === 0 && props.ts < .3) ctx.lineWidth += 2

/*       if (props.ts < .3) ctx.lineWidth += 8*(dataType+1)
      else if (props.ts < .4) ctx.lineWidth += 6*(dataType+1)
      else if (props.ts < .6) ctx.lineWidth += 4*(dataType+1) */

      const cc = (count+1)%3
      const s1 = 255
      const colors=[[s1,s1,0],[s1,0,s1],[0,s1,s1]]
      const [r,g,b] = colors[cc]
      ctx.strokeStyle = `rgba(${r},${g},${b},.7)`

      let x = 0

      let mid = dataType === 0 ? canvasDim.height/2 : canvasDim.height

      let scale = dataType === 0 ? canvasDim.height/255 * 3 
            : canvasDim.height/255/1.8

      let dx = canvasDim.width/n

      let displayData = musicData

      let zeroCount = 0
      let sumData = 0
      
      //let sumDataFinalThird = 0

      for (let i=0+offset; i<n-offset; i++) {
        
        //const freqScale= Math.sqrt(i+1)/Math.log(i+1)
  
        const y = dataType === 0 ? mid + (displayData[i]-128)*scale :
          mid - 30 - (displayData[i])*scale * Math.sqrt(i+1)/Math.log(i+1)

        ctx.beginPath();
        ctx.lineTo(x,y)
        ctx.lineTo(x,mid)
        x+=dx
        sumData += musicData[i]

        if (dataType === 1) {
          const ii = i % 2;
          let [R, G, B, A] = ii === 0 ? [255, 255, 0, 1] : [255, 150, 0, 1];

          const jj = i % 10;
          A = jj < 5 ? 1 : .7;

          ctx.strokeStyle = `rgba(${R},${G},${B},${A})`;
        }

        ctx.stroke()

      }
    

    } 

  };
  
  useEffect(() => {
    
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let frameCount = 0
    let animationFrameId
    
    //Our draw came here
    const render = () => {
      frameCount++
      draw(context, frameCount)
      animationFrameId = window.requestAnimationFrame(render)
    }
    render()
    
    return () => {
      window.cancelAnimationFrame(animationFrameId)
    }
  }, [draw])
  
  return <canvas ref={canvasRef} {...props}/>
}

export default Canvas