// sick!! really cool overall.
// ideas:
//    try to do it with just waveform, no triangles. Same flying feature though.
//    make the peaks look like mountains. green at bottom white at top or something
//    do something based on frequency
//    mess with color modulation more
// 


let cols, rows;
let scl = 10;
let zVals = [];
let zValsInner = [];
let w = 500;
let h = 900;
let flying = 0;5
let bitDepth = 1024

var mic, fft, trigger;
var weight = 2;

function setup() {
  createCanvas(1600, 1600, WEBGL); // WEBGL for 3d?
  cols = w/scl;
  rows = h/scl;

  zValsInner = new Array(Math.floor(cols)).fill(1)
  zVals = new Array(Math.floor(rows)).fill(zValsInner);

  // for osc
  mic = new p5.AudioIn();
  mic.start();


  fft = new p5.FFT(0.8, bitDepth);
  fft.setInput(mic);
}

function draw() {

  var waveform = fft.waveform(); // analyze the waveform
  flying -= .1;
  let yOffset = flying;

    for (let x=0; x < cols; x++) {
      yOffset += .2
      // zValsInner[x] = map(noise(xOffset,yOffset), 0, 1, -40, 40)
      zValsInner[x] = map(waveform[Math.floor(bitDepth/cols)*x], 0, 1, -60, 60)
    }
  
  // switching between these blocks switches direction of tracking

  // zVals.unshift(zValsInner)
  // if (zVals.length > Math.floor(rows)) {
  //   zVals.pop()
  // }

  zVals.push(zValsInner)
  if (zVals.length > Math.floor(rows)) {
    zVals.shift()
  }

  zValsInner= []


  background(0);
  stroke(255)
  noFill()
  frameRate(30)
  rotateX(PI/3);
  translate(-w/2, -height/2)

  for (let y=0; y < rows-1; y++) {
    if (y==rows-2) {
      stroke(255) // different color for first row
      strokeWeight(3)
    } else {
      stroke(255 - 255*(rows -y)/rows)
      strokeWeight(1)
    }
    

    beginShape(TRIANGLE_STRIP)
      for (let x=0; x < cols; x++) {
        
        vertex(x*scl, y*scl, zVals[y][x])
        vertex(x*scl, (y+1)*scl, zVals[y+1][x]) // add vertx of next row as well
        
      }
    endShape()
  }
}


function touchStarted() {
  getAudioContext().resume();
}
