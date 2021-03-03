import resolve from 'resolve';

class UploadService {
  async UploadToServer(img, name) {

    // const data = new FormData();

    // const parts = img[0].split(';')

    // data.append('file', parts[2].split(",")[1]);
    // data.append('filename', name);
    
    // let response = await fetch('https://facial-analysis-backend.herokuapp.com/api/upload/', {
    //   method: 'POST',
    //   body: data
    // })
    // let resp_data = await response.json()
    // const resp = null;

    // fetch('./text_data/image.json',{
    //   headers : { 
    //     'Content-Type': 'application/json',
    //     'Accept': 'application/json'
    //     }
    // }.then(function(response) {
    //     resp = response.json()
    // }))
    const data = await require('./image.json');
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, 3000);
    }).then(()=>{return data});
    



  }
 
  // getImages() {
  //   return http.get("/img");
  // }
}

export default new UploadService();