(function() {

  define(function() {
    var Sound;
    Sound = {
      cameraShot: function() {
        return soundManager.createSound("camera-click", "sound/camera_click.ogg").play();
      }
    };
    return Sound;
  });

}).call(this);
