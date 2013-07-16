
  var stage = new Kinetic.Stage({
    container: 'container',
    width: 700,
    height: 400
  });

  var layer = new Kinetic.Layer();

  var canvas = $('body').attr('tabindex', 0);
  var keys = undefined;
  var move = 3;

//animation
ancho_caminar = 70;
alto_sprite = 110;
var kenFrames = [
        //idle 0 1 2 3
        {
          x: 1,
          y: 15,
          width: 50,
          height: 90
        }, {
          x: 51,
          y: 15,
          width: 50,
          height: 90
        }, {
          x: 101,
          y: 15,
          width: 50,
          height: 90
        }, {
          x: 151,
          y: 15,
          width: 50,
          height: 90
        }, 
        //moving 4 5 6 7 8
        {
          x: 202,
          y: 15,
          width: 49,
          height: 90
        }, {
          x: 251,
          y: 15,
          width: 49,
          height: 90
        }, {
          x: 300,
          y: 15,
          width: 49,
          height: 90
        }, {
          x: 349,
          y: 15,
          width: 49,
          height: 90
        }, {
          x: 398,
          y: 15,
          width: 49,
          height: 90
        }, 
        //punch 9 10 11
        {
          x: 0,
          y: 130,
          width: 50,
          height: 90
        },
        {
          x: 51,
          y: 130,
          width: 66,
          height: 90
        }, {
          x: 167,
          y: 130,
          width: 50,
          height: 90
        },
        //hadouken 12 13 14 15
        {
          x: 614,
          y: 530,
          width: 55,
          height: 85
        }, {
          x: 668,
          y: 530,
          width: 72,
          height: 85
        }, {
          x: 740,
          y: 530,
          width: 72,
          height: 85
        }, {
          x: 812,
          y: 530,
          width: 77,
          height: 85
        },
        //power 16 17
        {
          x: 890,
          y: 545,
          width: 34,
          height: 34
        }, {
          x: 924,
          y: 545,
          width: 34,
          height: 34
        }, {
          x: ancho_caminar*6,
          y: 735,
          width: 55,
          height: alto_sprite
        }, {
          x: ancho_caminar*6+55,
          y: 735,
          width: 55,
          height: alto_sprite
        }, {
          x: 0,
          y: 565,
          width: 100,
          height: 120
        }, {
          x: 87,
          y: 562,
          width: 95,
          height: 130
        }, {
          x: 182,
          y: 562,
          width: 95,
          height: 130
        }
];
var animations = {
  idle: [kenFrames[0],
    kenFrames[1],
    kenFrames[2],
    kenFrames[3]
  ],
  move:[kenFrames[4],
    kenFrames[5],
    kenFrames[6],
    kenFrames[7],
    kenFrames[8]
  ],
  punch: [kenFrames[9],
    kenFrames[10],
    kenFrames[11]
  ],
  hadouken: [kenFrames[12],
    kenFrames[13],
    kenFrames[14],
    kenFrames[15]
  ],
  restoreHadouken: [
    kenFrames[14],
    kenFrames[13],
  ],
  power: [kenFrames[16],
    kenFrames[17]],
  moveDown:[kenFrames[20],
    kenFrames[21]],
    down:[kenFrames[22]
  ],
  moveUp:[kenFrames[21],
    kenFrames[20]
  ],
};
var imageObj = new Image();
window.blob = new Kinetic.Sprite({
  x: 250,
  y: 100,
  image: imageObj,
  animation: 'idle',
  animations: animations,
  frameRate: 9,
  index: 0
});
window.character = {'x':blob.getAttrs('x'),
                   'y':blob.getAttrs('y'),
                   'state': 'idle'
                  };
imageObj.onload = function() {

  // add the shape to the layer
  layer.add(blob);

  // add the layer to the stage
  stage.add(layer);

  // start sprite animation
  blob.start();
  $('canvas').css('background-color', '#80B8A8');
  gKeys.init();
  keys = gKeys.keys;
  gKeys.registerMove(['DOWN', 'RIGHT', 'SPACE'], function(){
    hadouken();
  });
};
imageObj.src = 'imgs/ken.gif';


var downed = false;
var down = function(){
  if(!downed){
    blob.setAnimation('moveDown');
    blob.afterFrame(1, function() {
      blob.setAnimation('down');
    });
    downed=true;
  }
};
var up = function(){
  if(downed){
    blob.setAnimation('moveUp');
    blob.afterFrame(1, function(){
      blob.setAnimation('idle');
    })
    downed=false;
  }
}
//listener
var moving = false;
var changeAnimation = function(animation){
  blob.setAnimation(animation);
};
var punch = function(){
  blob.setAnimation('punch');
    blob.afterFrame(2, function() {
      blob.setAnimation('idle');
  });
};
var hadoukens = [];
var hadouken = function(){
  var createHadouken = function(){
    var power = new Image();
    var powerBlob = new Kinetic.Sprite({
      x: blob.getAttr('x')+50,
      y: 120,
      image: imageObj,
      animation: 'power',
      animations: animations,
      frameRate: 9,
      index: 0
    });
    power.onload = function() {
      layer.add(powerBlob);
      stage.add(layer);
      powerBlob.start();
    };
    hadoukens.splice(0,0,powerBlob);
    power.src = 'imgs/ken.gif';

  }

  blob.setAnimation('hadouken');
  blob.afterFrame(3, function() {
    createHadouken();
    blob.setAnimation('idle');
  });
}
var anim = new Kinetic.Animation(function(frame) {

  var x = blob.getAttr('x');
  var y = blob.getAttr('y');
  var moved=false;
  if(keys){
    if(keys.LEFT.down){
        x -= move;
        if(x<-100){
          x = 700;
        }
      moved = true;
    }else if(keys.RIGHT.down){
        x += move;
        if(x>700){
          x= -100;
        }
      moved = true;
    }
    if(keys.SPACE.down){
      //hit a punch
      punch();
    }
  }
  if(!moving&&moved){
    changeAnimation('move');
    moving=moved;
  }else if(moving&&!moved){
    changeAnimation('idle');
    moving=moved;
  }
  if(moved){
    blob.setAttrs({'x':x, 'y':y});
    character.x = x;
    character.y = y;
    character.state = blob.getAnimation();
    if(window.connected){
      window.channel.send(character);
    }
  }

  for(var i= hadoukens.length-1; i>=0; i--){
    var hx = hadoukens[i].getAttr('x');
    hadoukens[i].setAttr('x', hx+5);
    if(hx>700){
      hadoukens[i].remove();
      delete hadoukens[i];
      hadoukens.length--;
    }
  }

}, layer);

anim.start();


