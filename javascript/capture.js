define([
  'javascript/filter.js'
],function(Filter){
  var video = {
    deferred: $.Deferred(),
    videoId : 'video',
    previewSize:{
      width: 197*0.3,
      height: 351*0.3
    },

    capture: function(video, size) {
      var $video = $(video);

      var $device = $('#device');
      var scaleFactor =  video.videoWidth/$video.width()

      var canvas = document.createElement('canvas');
      canvas.width  = size.width;
      canvas.height = size.height;
      var ctx = canvas.getContext('2d');
      var sX = ($('#device').position().left+ 22)*scaleFactor;
      var sY = 29*scaleFactor;
      var sWidth = 197*scaleFactor;
      var sHeight = 351*scaleFactor;

      ctx.drawImage(video, sX, sY, sWidth, sHeight,
          0,0, canvas.width, canvas.height);
      //ctx.drawImage(video, sX, sY, $device.width(), $device.height());
      return canvas;
    },


    /**
     * Invokes the <code>capture</code> function and attaches the canvas element to the DOM.
     */
    shoot: function(size){
        size = size || this.previewSize;
        var video  = $(this.videoId)[0];
        var currentTime = video.currentTime;
        var output = $('#output');
        var canvas = this.capture(video, size);
        $filter = $('input[name="filter"]:checked');
        if($filter.val()){
          Filter[$filter.val()](canvas);
        }
        $(canvas).data('currentTime', currentTime).prependTo($('#output'));
        //console.log(canvas.toDataURL());
        //output.prepend(canvas);
    },

    preview: function(currentTime){
      var me = this;
      $preview = $('.preview');
      var size = {
        width:$preview.width(),
        height: $preview.height()
      };
      var bgVideo  = $('#backgroundVideo')[0];
      bgVideo.currentTime = currentTime;
      $preview.empty().show();

      //capture while seeked
      this.deferred = $.Deferred();
      this.deferred.done(function(){
        var output = $('#output');
        var canvas = me.capture(bgVideo, size);
        $filter = $('input[name="filter"]:checked');
        if($filter.val()){
          Filter[$filter.val()](canvas);
        }
        $preview.append($(canvas).hide());
        $(canvas).fadeIn('fast');

        //$('body').append($(canvas));
      });
    }
  }

  $(document).ready(function(){
    var $backgroundVideo = $('#video').clone().attr({
      'loop': false,
      'id':'backgroundVideo'
    }).appendTo('#bg');
    video.backgroundVideo = $backgroundVideo[0];
    video.backgroundVideo.muted = true;
    video.backgroundVideo.load();
    //trigger seeked
    $backgroundVideo.bind('seeked', function(){
      if(video.deferred)
        video.deferred.resolve();
    });
  });
  return video;

})
