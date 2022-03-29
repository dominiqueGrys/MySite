const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioCtx = new AudioContext();


medianPoint= {x:0, y:0};


var canvas = document.createElement("canvas");  
var ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.id = "canvas";
document.body.appendChild(canvas);  
update_canvas = 0;
let coord = { x: 0, y: 0 };


window.addEventListener('resize', resize);
function resize() {
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
}


function reposition(event) {
  coord.x = event.clientX - canvas.offsetLeft;
  coord.y = event.clientY - canvas.offsetTop;
}

function assignToDiv(){ // this kind of function you are looking for
  dataUrl = canvas.toDataURL();
  document.getElementById('content').style.background='url('+dataUrl+')'
}

function draw(event) {
  update_canvas++;
  ctx.beginPath();
  ctx.globalAlpha = 1.0;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#f3b809';
  ctx.clearRect(0, 0, canvas.width, canvas.height);




  if (update_canvas>1){
    ctx.moveTo(0, coord.y);
  }

  reposition(event);
  ctx.lineTo(window.innerWidth, coord.y);
  ctx.stroke();

  if (update_canvas>1){
    ctx.moveTo(coord.x, 0);
  }

  reposition(event);
  ctx.lineTo(coord.x,window.innerHeight);

  ctx.stroke();

  drawMusicItems();
  convergeOscs();

  if(update_canvas%5==0){
    assignToDiv();
  }

}

function convergeOscs(){
  for(var i =0; i<SoundsArray.length; i++){
    SoundsArray[i].o.frequency.value += (medianPoint.x-SoundsArray[i].o.frequency.value)/100;
    SoundsArray[i].x += (medianPoint.x-SoundsArray[i].x)/100;
    SoundsArray[i].y += (medianPoint.y-SoundsArray[i].y)/100;
  }


}


function handleMouseClick(event) {
  var eventDoc, doc, body;

  event = event || window.event; // IE-ism

  // If pageX/Y aren't available and clientX/Y are,
  // calculate pageX/Y - logic taken from jQuery.
  // (This is to support old IE)
  if (event.pageX == null && event.clientX != null) {
      eventDoc = (event.target && event.target.ownerDocument) || document;
      doc = eventDoc.documentElement;
      body = eventDoc.body;

      event.pageX = event.clientX +
        (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
        (doc && doc.clientLeft || body && body.clientLeft || 0);
      event.pageY = event.clientY +
        (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
        (doc && doc.clientTop  || body && body.clientTop  || 0 );
  }



  return {t:new Date(),f:Math.floor(Math.random() * 500) + 250, x: event.pageX , y: event.pageY , s:Math.floor(Math.random() * 50) + 30}

}

function printCircle(item){
  const centerX = item.x;
  const centerY = item.y;
  const radius = item.s+Math.floor(Math.random() * 2) -1;

  item_time = new Date() - item.t;

  console.log((100.0/(item_time+1)));

  if(item_time> 10000){
    console.log("item die time");
    setTimeout(() => {SoundsArray.splice(SoundsArray.indexOf(item), 1);}, 9000);

    return;
  }

  ctx.beginPath();
  ctx.globalAlpha = 0.2+(100.0/(item_time+1));
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
  ctx.fill();

  ctx.stroke();
}

var SoundsArray = Array();

function drawMusicItems(){
  for(var i =0; i<SoundsArray.length; i++){
    printCircle(SoundsArray[i]);
  }
}

function calc_median(){
  var x_total = 0;
  var y_total = 0;

  for(var i =0; i<SoundsArray.length; i++){
    x_total+=SoundsArray[i].x;
    y_total+=SoundsArray[i].y;
  }

  if(SoundsArray.length>0){
    medianPoint.x = x_total/SoundsArray.length;
    medianPoint.y = y_total/SoundsArray.length;

  }
  

}


function putSound(event){
  
 
  var mouselocation =  handleMouseClick(event)



  let osc = audioCtx.createOscillator();
  let g = audioCtx.createGain();
  g.gain.setValueAtTime(0.1, audioCtx.currentTime);
  g.gain.linearRampToValueAtTime(0.0, audioCtx.currentTime + 10);
  osc.type = 'sine';
  osc.frequency.value = mouselocation.f;
  osc.connect(g).connect(audioCtx.destination);
  osc.start(audioCtx.currentTime);

  mouselocation.o = osc;


  SoundsArray.push(mouselocation);

  if(SoundsArray.length>10){
    SoundsArray.shift();
  }

  calc_median();

}


document.addEventListener('mousemove', draw);

document.addEventListener('mousedown', putSound);

assignToDiv()
