
const fetchGetOptions = {
    method: "GET",  // mode: "cors",  //no need cors anymore
    headers:{
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "http://127.0.0.1:8080", 
      "Accept": "application/json",
      "mode": "no-cors"
    }
  };

//to make promiseFetch awiatable we need to
//return a new Promise object
const promiseFetch = url => {
  console.log('fetch options:',fetchGetOptions)
  let tmp;  //we need this to access response.status in then chain
  return new Promise( (resolve, reject) => {
    fetch(url, fetchGetOptions)
      .then( response => { tmp=response.status; return response.json()} )
      .then( data => {
        resolve({status:tmp, data:data});
      })
      .catch( err => {
        reject(err);
      });
  });
};

export default promiseFetch;