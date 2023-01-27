import { songDB } from './songs.js'

let albums =  {};  //convert to array later
let albumId = 0;
let artists  = {};
let artistId = 0;
let songId = 0;

console.log( songDB );

for ( let song of songDB ) {

    song.id = songId;
    songId ++;

    if ( !artists[song.artist] ) {
        artists[song.artist] = {name:song.artist, id:artistId};
        artistId ++;
    }

    if ( !albums[song.album] ) {
        albums[song.album]= { 
            name:  song.album,
            id: albumId,
            artist: artists[song.artist],
            artworkUrl: song.artworkUrl,
            songs: [song]}
        albumId ++;
    }
    else {
        albums[song.album].songs.push(song);
    }

}

function toArray(obj) {
    let aa = [];
    for ( const [key,value] of Object.entries(obj)) {
        aa.push(value)
    }
    return aa;
}
const Albums = toArray(albums);
const Artists = toArray(artists);

console.log(Albums);

export { Albums, Artists};

