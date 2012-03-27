require([
  'module',
  'javascript/capture.js',
  'javascript/sound.js'
], function(module, video, sound){

  var flashIt = function(){
    $('.flash').css('opacity', 0.5).show().animate({opacity:0}, 100);
  };
  var captureSt = null;
  $('#control').on('click', function(){

    if($(this).hasClass('play')){
      $('#video')[0].play();
      $(this).removeClass().addClass('shot');
    }else if($(this).hasClass('shot')){
      console.log('trigger shot!!')
      flashIt();

      video.shoot();
      sound.cameraShot();
      event.stopPropagation();
    }
  }).on('mousedown touchstart', function(){
    if($(this).hasClass('shot')){
      captureSt = setInterval(function(){
        flashIt();
        video.shoot();
        sound.cameraShot();
      }, 100);
    }
  });

  $('#output canvas').live('click', function(){
    var currentTime = $(this).data('currentTime');
    video.preview(currentTime);
  });

  $('.preview').live('click', function(){
    $(this).fadeOut('fast');
  });

  $(document).on('mouseup touchend', function(){
    clearInterval(captureSt);
    /*
    if($('.preview').is(':visible')){
      $('.preview').trigger('click');
    }*/
  })


  $('#control').on('dblclick', function(event){
    event.preventDefault();

  });

  $('#device').draggable({ axis: "x" , containment: "parent"});

})
