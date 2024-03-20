const camCanvas = document.getElementById('camCanvas');
const camCtx = camCanvas.getContext('2d',{ willReadFrequently: true });
const inputModeEl = document.getElementById('inputMode');
const startBtn = document.getElementById('startBtn');
const sliders = document.getElementById('sliders');
const info = document.getElementById('info');
let video = null;
let mode = 'mouse';

inputModeEl.onchange = (e)=>{
  video = null;
  mode = e.target.value;
  if(mode==='mouse'){
    initMouseMode();
    sliders.style.display = 'flex';
  }else{
    initCamera();
    animate();
    canvas.removeEventListener('mousemove',mouseMove);
    sliders.style.display = 'none';
  }
  if(mode==='camera'){
    startBtn.style.display = 'block';
    info.style.display = 'flex';
  }else{
    startBtn.style.display = 'none';
    info.style.display = 'none';
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
  }
}
