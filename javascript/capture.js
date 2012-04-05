(function() {

  define(["javascript/filter.js"], function(Filter) {
    var Video;
    Video = {
      deferred: $.Deferred(),
      videoId: "video",
      previewSize: {
        width: 197 * 0.3,
        height: 351 * 0.3
      },
      capture: function(video, size) {
        var $device, $video, canvas, ctx, sHeight, sWidth, sX, sY, scaleFactor;
        $video = $(video);
        $device = $("#device");
        scaleFactor = video.videoWidth / $video.width();
        canvas = document.createElement("canvas");
        canvas.width = size.width;
        canvas.height = size.height;
        ctx = canvas.getContext("2d");
        sX = ($("#device").position().left + 22) * scaleFactor;
        sY = 29 * scaleFactor;
        sWidth = 197 * scaleFactor;
        sHeight = 351 * scaleFactor;
        ctx.drawImage(video, sX, sY, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
        return canvas;
      },
      shoot: function(size) {
        var $filter, canvas, currentTime, output, video;
        size = size || this.previewSize;
        video = $(this.videoId)[0];
        currentTime = video.currentTime;
        output = $("#output");
        canvas = this.capture(video, size);
        $filter = $('input[name="filter"]:checked');
        if ($filter.val()) Filter[$filter.val()](canvas);
        return $(canvas).data("currentTime", currentTime).prependTo($("#output"));
      },
      preview: function(currentTime) {
        var $preview, bgVideo, size,
          _this = this;
        $preview = $(".preview");
        size = {
          width: $preview.width(),
          height: $preview.height()
        };
        bgVideo = $("#backgroundVideo")[0];
        bgVideo.currentTime = currentTime;
        $preview.empty().show();
        this.deferred = $.Deferred();
        return this.deferred.done(function() {
          var $filter, canvas, output;
          output = $("#output");
          canvas = _this.capture(bgVideo, size);
          $filter = $('input[name="filter"]:checked');
          if ($filter.val()) Filter[$filter.val()](canvas);
          $preview.append($(canvas).hide());
          return $(canvas).fadeIn("fast");
        });
      }
    };
    $(document).ready(function() {
      var $backgroundVideo;
      $backgroundVideo = $("#video").clone().attr({
        loop: false,
        id: "backgroundVideo"
      }).appendTo("#bg");
      Video.backgroundVideo = $backgroundVideo[0];
      Video.backgroundVideo.muted = true;
      Video.backgroundVideo.load();
      return $backgroundVideo.bind("seeked", function() {
        if (!Video.deferred.isResolved()) return Video.deferred.resolve();
      });
    });
    return Video;
  });

}).call(this);
