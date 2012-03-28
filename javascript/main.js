(function() {

  require(["module", "javascript/capture.js", "javascript/sound.js"], function(module, video, sound) {
    var captureSt, flashIt;
    flashIt = function() {
      return $(".flash").css("opacity", 0.5).show().animate({
        opacity: 0
      }, 100, function() {
        return $(this).hide();
      });
    };
    captureSt = null;
    $("#control").on("click", function() {
      if ($(this).hasClass("play")) {
        $("#video")[0].play();
        return $(this).removeClass().addClass("shot");
      } else if ($(this).hasClass("shot")) {
        flashIt();
        video.shoot();
        sound.cameraShot();
        return event.stopPropagation();
      }
    }).on("mousedown touchstart", function() {
      if ($(this).hasClass("shot")) {
        return captureSt = setInterval(function() {
          flashIt();
          video.shoot();
          return sound.cameraShot();
        }, 100);
      }
    });
    $("#output canvas").live("click", function() {
      var currentTime;
      currentTime = $(this).data("currentTime");
      return video.preview(currentTime);
    });
    $(".preview").live("click", function() {
      return $(this).fadeOut("fast");
    });
    $(document).on("mouseup touchend", function() {
      return clearInterval(captureSt);
    });
    $("#control").on("dblclick", function(event) {
      return event.preventDefault();
    });
    return $("#device").draggable({
      axis: "x",
      containment: "parent"
    });
  });

}).call(this);
