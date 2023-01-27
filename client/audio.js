
//audio is the html audio component that
//has been loaded
class AudioVisualizer {
    //we really only want to 
    //instantiate this thing once
    //and then update which audio source
    //is connected/which file is playing

    audioHTML
    AC   //AudioContext
    AA   //analyser
    lastNonZeroData = null
    initialized = false
    AudioSource = null
    canVisualize = false
    play = false

    constructor() {
        //this.init()
    }

    init() {
        this.AC = new AudioContext()
        this.AA = this.AC.createAnalyser()
        this.AA.fftSize = 2048

        if (this.AC)
            this.initialized = true

        console.log('initialization:',this.initialized)
    }

    changeAudio(audioHTML) {

        if ( !this.initialized) {
            this.init()
        }

        //we can only createMediaElementSource once but we need an audio
        //element, so wait for just the first time
        if (!this.AudioSource && this.canVisualize)
            this.AudioSource = this.AC.createMediaElementSource(audioHTML)
            //once we connect an audio element to createMediaElementSource
            //it is stuck there forever, good news is that we can 
            //create a different audio element to deal with it 
            //console.log('xxxxxxxxxxxx',this.AudioSource)

        if ( this.canVisualize) {
            console.log( ' connecting new audio ',audioHTML)
            this.AudioSource.connect(this.AA)
            this.AA.connect(this.AC.destination)
        }
        else {
           //disconnecting/deleting does not prevent
           //the AudioSource from getting Cors error once it
           //has already been connected once to analyzer
        }
        
    }

    getTimeDomainData() {
        if (this.AA &&  this.initialized) {
            let dataArray = new Uint8Array(this.AA.fftSize)
            this.AA.getByteTimeDomainData(dataArray)
            return dataArray
        }
        return null
    }

    getFrequencyData() {
        if (this.AA &&  this.initialized) {
            let dataArray = new Uint8Array(this.AA.fftSize)
            this.AA.getByteFrequencyData(dataArray)
            return dataArray
        }
        return null
    }
    //would it be worth it to get Float32 data?

    saveGoodData(nonZeroData) {
        this.lastNonZeroData = [...nonZeroData]
        //console.log('zzzzzzzz',this.lastNonZeroData[10])
    }

    setCanVisualize(input) { this.canVisualize=input}

}

export default AudioVisualizer
