const camCanvas = document.getElementById('camCanvas');
const camCtx = camCanvas.getContext('2d',{ willReadFrequently: true });
const inputModeEl = document.getElementById('inputMode');
let video = null;
let mode = 'mouse';

inputModeEl.onchange = (e)=>{
  video = null;
  mode = e.target.value;
  if(mode==='mouse'){
    initMouseMode();
  }else{
    initCamera();
    animate();
  }
}

function initCamera(){
  if(mode==='camera' || mode==='video1' || mode==='video2'){
    navigator.mediaDevices.getUserMedia({video:true})
    .then((data)=>{
      video = document.createElement('video');
      if(mode==='camera'){
        video.srcObject = data;
      }else if(mode==='video1'){
        video.src = './my-video1.mp4';
        video.volume = 0;
      }else if(mode==='video2'){
        video.src = './my-video2.mp4';
        video.volume = 0;
      }
      
      video.play();
      video.onloadeddata = ()=>{
        camCanvas.width = video.videoWidth;
        camCanvas.height = video.videoHeight;
      }
    })
    .catch((err)=>{
      console.log('error:', err)
    })
  }else{
    closeCamera();
  }
}

function closeCamera(){
  video = null;
}