require([
  'module',
  'javascript/capture.js',
  'javascript/sound.js'
], function(module, video, sound){



  var captureSt = null;
  $('#control').on('click', function(){

    if($(this).hasClass('play')){
      $('#video')[0].play();
      $(this).removeClass().addClass('shot');
    }else if($(this).hasClass('shot')){
      console.log('trigger shot!!')

      video.shoot();
      sound.cameraShot();
      event.stopPropagation();
    }
  }).on('mousedown touchstart', function(){
    if($(this).hasClass('shot')){
      captureSt = setInterval(function(){
        video.shoot();
        sound.cameraShot();
      }, 100);
    }
  });

  $(document).on('mouseup touchend', function(){
    clearInterval(captureSt);
  })


  $('#control').on('dblclick', function(event){
    event.preventDefault();

  });

  $('#device').draggable({ axis: "x" , containment: "parent"});

})
