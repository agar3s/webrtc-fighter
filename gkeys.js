(function(window, document, undefined){

  var gKeys = function(){
    //the Key object
    var Key = function(){
      this.down = false;
      this.startTime = 0;
      this.finalTime = 0;
    };
    //the Move object
    var Move = function(){
      this.sequence = [],
      this.callback = function(){};
    };
    var keys = {                        //the avalaible keys
                UP: new Key(),
                DOWN: new Key(),
                LEFT: new Key(),
                RIGHT: new Key(),
                SPACE: new Key()
               },
        mapKeys = {                     //key codes for the keys
                  37: 'LEFT',
                  38: 'UP',
                  39: 'RIGHT',
                  40: 'DOWN',
                  32: 'SPACE',
                  //virtual keys
                  'vkLeft': 'LEFT',
                  'vkUp': 'UP',
                  'vkRight': 'RIGHT',
                  'vkDown': 'DOWN',
                  'vkSpace': 'SPACE',
                },
        canvas = null,                  //the canvas object
        kdCallback = function( keys ){},//key down callback function
        kuCallback = function( keys ){},//key up callback function
        allowsHistory = true,           //allows the history functions, required for the moves function
        history = [],                   //register of the last key ups
        maxHistory = 10,                //maximun keys allowed in the history array
        maxTime = 1000,                 //time a key is in the history, in miliseconds
        moveList = [],                  //a list with the moves registered
        minimalList = maxHistory;       //minimal keys in the history neccesary to do a move inspection


    //inspect changes in the keys object
    //key: the key code
    //down: if the key is down or up
    var mapping = function( key, down ){
      if(key in mapKeys){
        keys[mapKeys[key]].down = down;
      }
    };

    var keyDowns = function(e){
      var key = e.keyCode ? e.keyCode : e.which;
      if(key in mapKeys){
        key = keys[mapKeys[key]];
        if(!key.down){
          key.down = true;
          key.startTime = new Date().getTime();
          key.finalTime = 0;
        }
        kdCallback(keys);
      }
      e.preventDefault();
    };

    var keyUps = function(e){
      var key = e.keyCode ? e.keyCode : e.which,
          localKeys = {};
      e.preventDefault();
      mapping(key, false);
      
      if(key in mapKeys){
        keys[mapKeys[key]].finalTime = new Date().getTime();
        if(allowsHistory){
          localKeys[mapKeys[key]] = maxTime;
          addHistoryRecord(localKeys);
        }
        kuCallback(keys);
      }
    };    

    //history 
    var addHistoryRecord = function(localKeys){
      history.splice(0, 0, localKeys);
      validateMoves();
      while(history.length > maxHistory){
        history.pop();
      }
    };
    var cleanHistory = function(){
      for(keysHistory in history){
        for(key in history[keysHistory]){
          if (!history[keysHistory].hasOwnProperty(key)) continue;
          
          history[keysHistory][key]--;
          if(history[keysHistory][key] < 0){
            history.pop();  
            break;
          }
        }
      }
    };

    //Moves
    var registerMove = function(sequence, callback){
      var move = new Move(),
          added = false;
      move.sequence = sequence;
      move.callback = callback;

      for (var i = 0; i < moveList.length; i++) {
        if(move.sequence.length > moveList[i].sequence.length){
          moveList.splice(i, 0, move);
          added = true;
          break;
        }
      };
      if(!added){
        moveList.push(move);
      }
      if(sequence.length < minimalList){
        minimalList = sequence.length;
      }
    }
    
    var validateMoves = function(){
      var move, isMove, sequence, sequenceLength;
      if(history.length < minimalList) return;

      for(var i = 0; i < moveList.length; i++){
        move = moveList[i];
        isMove = true;
        sequence = move.sequence;
        sequenceLength = sequence.length-1;
        if(history.length <= sequenceLength) continue;

        for(var j = 0; j <= sequenceLength; j++){
          isMove = isMove && history[j][sequence[sequenceLength-j]];
        }
        if(isMove){
          move.callback();
          return;
        }
      }
    }

    //virtual keyBoard
    var isMobile = function(){
      var regexp1 = new RegExp('/(android|bb\d+|meego).+mobile|avantgo|bada\/'+
                '|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)'+
                '|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?'+
                '|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.'+
                '(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i');
      var regexp2 = new RegExp('/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|'+
                'a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)'+
                '|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)'+
                '|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-'+
                '|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi'+
                '|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8'+
                '|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo'+
                '|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)'+
                '|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)'+
                '|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a'+
                '|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)'+
                '|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)'+
                '|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do'+
                '|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)'+
                '|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph'+
                '|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))'+
                '|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a'+
                '|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)'+
                '|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|'+
                '47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)'+
                '|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)'+
                '|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9'+
                '|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40'+
                '|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|'+
                'wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i');
      return regexp1.test(navigator.userAgent||navigator.vendor||window.opera)||
      regexp2.test(navigator.userAgent||navigator.vendor||window.opera.substr(0,4));
    };

    var init = function(){
      canvas = document.getElementsByTagName('canvas')[0];
      canvas.setAttribute('tabIndex', 1);
      canvas.addEventListener('keydown',  keyDowns);
      canvas.addEventListener('keyup',  keyUps);
      canvas.focus();

      if(isMobile()||true){
        //load virtual keyboard
        var virtualKeyboard = document.createElement('div');
        virtualKeyboard.id='virtualKeys';
        virtualKeyboard.innerHTML = '<button class="vk" id="vkSpace"></button>'+
                               '<button class="vk" id="vkUp"></button>'+
                               '<button class="vk" id="vkDown"></button>'+
                               '<button class="vk" id="vkLeft"></button>'+
                               '<button class="vk" id="vkRight"></button>';
        document.body.appendChild(virtualKeyboard);

        //if virtualkeys
        var collection = document.getElementById('virtualKeys').children;
          for(var i = 0; i<collection.length; i++){
            var link = collection[i];
            link.onclick = function(event){
              return false;
            };
            link.onmousedown = function(event){
              mapping(this.id, true);
              if(this.id=="vkSpace"){
                kdCallback(keys);
              }
              return false;
            };
            link.onmouseup = function(event){
              mapping(this.id, false);
              canvas.focus();
              return false;
            };
            link.addEventListener('touchstart', function(e){
                mapping(this.id, true);
                e.preventDefault();
            }, false);
            link.addEventListener('touchend', function(e){
              mapping(this.id, false);
              e.preventDefault();
            }, false);

          }
        }
      };

    return {
      'init': init,
      'keyDown': function( callback ){
        kdCallback = callback;
      },
      'keyUp': function( callback ){
        kuCallback = callback;
      },
      'keys': keys,
      'registerMove': registerMove,
      'history': history
    };

  }();
  window.gKeys = gKeys;

})(window, document);