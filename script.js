const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;
const skinTone = 'rgb(232, 190, 172)';
const img = new Image();
img.width = 100;
img.height = 100;
img.src = 'avatar.png';
const avatar = new Avatar(skinTone);

const refPoints = [];
let redPoint = null;
let bluePoint = null;
let greenPoint = false;
let mouthX = 0;
let refMouthX = 0;
let mouthY = 0;
let refMouthY = 0;

const sliderX = document.getElementById('mouthX');
sliderX.onchange = (e)=>{
  updateMouthX(sliderX.value);
}
const sliderY = document.getElementById('mouthY');
sliderY.onchange = (e)=>{
  updateMouthY(sliderY.value);
}

initMouseMode();

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  let offsetX = 0;
  let offsetY = 0;
  
  if(video){
    camCanvas.style.display = 'block'
    camCtx.drawImage(video,0,0);
    const imageData = camCtx.getImageData(0,0,camCanvas.width,camCanvas.height);
    
    const locs = getMarkedLocs(imageData);
  
    let mouthBottomPoint = null;
    let mouthUpPoint = null;
    if(locs[1].length){
      const {mouthLeft,mouthRight,mouthUp,mouthBottom} = getMouthPoints(locs[1]);
      const mouthLeftPoint = average(mouthLeft);
      const mouthRightPoint = average(mouthRight);
      mouthUpPoint = average(mouthUp);
      mouthBottomPoint = average(mouthBottom);
      
      mouthX = distance(mouthRightPoint,mouthLeftPoint);
      mouthY = distance(mouthBottomPoint,mouthUpPoint);
      
      drawPoint(camCtx,mouthLeftPoint[0],mouthLeftPoint[1],'orange',15);
      drawPoint(camCtx,mouthRightPoint[0],mouthRightPoint[1],'orange',15);
      drawPoint(camCtx,mouthUpPoint[0],mouthUpPoint[1],'green',15);
      drawPoint(camCtx,mouthBottomPoint[0],mouthBottomPoint[1],'green',15);
      greenPoint = true;
    }else{
      greenPoint = false;
      mouthBottomPoint = null;
      mouthUpPoint = null;
    } 

    if(locs[0].length && mouthBottomPoint){
      const points = locs[0].filter((loc)=>loc.y>mouthBottomPoint[1]);
      redPoint = average(points);
    }else{
      redPoint = null;
    } 

    if(locs[2].length && mouthUpPoint){
      const points = locs[2].filter((loc)=>loc.y<mouthUpPoint[1]);
      bluePoint = average(points);
    }else{
      bluePoint = null;
    } 
    
    if(bluePoint){
      drawPoint(camCtx,bluePoint[0],bluePoint[1],'blue',10);
    }
    if(redPoint){
      drawPoint(camCtx,redPoint[0],redPoint[1],'red',10);
    }

    if(redPoint && bluePoint && refPoints.length){
      offsetX = (bluePoint[0]-redPoint[0]+refPoints[0]);
      offsetY = bluePoint[1]-redPoint[1]+refPoints[1];
    }
    if(mode==='video1' || mode==='video2' && refMouthX === 0){
      fixPoints();
    }
  }
  
  ctx.save();
  ctx.translate(188,164);
  avatar.draw(ctx,offsetX,offsetY,mouthX-refMouthX,mouthY-refMouthY);
  ctx.restore();
  if(mode!=="mouse"){
    requestAnimationFrame(animate);
  }else{
    camCanvas.style.display = 'none'
  }
  
}

function initMouseMode(){
  canvas.addEventListener('mousemove',(e)=>{
    ctx.clearRect(0,0,canvas.width,canvas.height);
      
    let {offsetX, offsetY} = e;
    offsetX -= 188;
    offsetY -= 164;
    //ctx.drawImage(img,0,0,400,400);
      
    ctx.save();
    ctx.translate(188,164);
      
    avatar.draw(ctx,offsetX,offsetY,mouthX,mouthY);
    
    ctx.restore();
  });
}

canvas.addEventListener('click',(e)=>{
  const {offsetX, offsetY} = e;
  console.log(offsetX-188 +','+ (offsetY-164));
})

function fixPoints(){
  if(redPoint && bluePoint && greenPoint){
    refPoints[0] = redPoint[0]-bluePoint[0];
    refPoints[1] = redPoint[1]-bluePoint[1];
    refMouthX = mouthX;
    refMouthY = mouthY;
    console.log("done");
  }else{
    console.log("can't find the colors");
  }
}

function updateMouthX(x){
  mouthX = x;
}
function updateMouthY(y){
  mouthY = y
}

function getMouthPoints(locs){
  const mouthLeft = [];
  const mouthRight = [];
  const mouthUp = [];
  const mouthBottom = [];

  let mostLeftPoint = 10000;
  let mostRightPoint = -10000;
  let mostUpPoint = 10000;
  let mostBottomPoint = -10000;

  
  for(let i = 0;i<locs.length;i++){
    const {x,y} = locs[i];
    mostLeftPoint = Math.min(mostLeftPoint,x);
    mostRightPoint = Math.max(mostRightPoint,x);
    mostUpPoint = Math.min(mostUpPoint,y);
    mostBottomPoint = Math.max(mostBottomPoint,y);
  }

  for(let i = 0;i<locs.length;i++){
    const {x,y} = locs[i];
    
    const lDist = Math.abs(mostLeftPoint-x);
    const rDist = Math.abs(mostRightPoint-x);
    const uDist = Math.abs(mostUpPoint-y);
    const bDist = Math.abs(mostBottomPoint-y);

    const min = Math.min(lDist,rDist,uDist,bDist)
    if(lDist===min){
      mouthLeft.push(locs[i])
    }else if(rDist===min){
      mouthRight.push(locs[i])
    }else if(uDist===min){
      mouthUp.push(locs[i]);
    }else{
      mouthBottom.push(locs[i]);
    }
  }
  return {
    mouthLeft,
    mouthRight,
    mouthUp,
    mouthBottom
  }
}