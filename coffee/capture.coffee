define [ "javascript/filter.js" ], (Filter) ->
  Video =
    deferred: $.Deferred()
    videoId: "video"
    previewSize:
      width: 197 * 0.3
      height: 351 * 0.3

    capture: (video, size) ->
      $video = $(video)
      $device = $("#device")
      scaleFactor = video.videoWidth / $video.width()
      canvas = document.createElement("canvas")
      canvas.width = size.width
      canvas.height = size.height
      ctx = canvas.getContext("2d")
      sX = ($("#device").position().left + 22) * scaleFactor
      sY = 29 * scaleFactor
      sWidth = 197 * scaleFactor
      sHeight = 351 * scaleFactor
      ctx.drawImage video, sX, sY, sWidth, sHeight, 0, 0, canvas.width, canvas.height
      #ctx.drawImage(video, sX, sY, $device.width(), $device.height());
      canvas

    shoot: (size) ->
      size = size or @previewSize
      video = $(@videoId)[0]
      currentTime = video.currentTime
      output = $("#output")
      canvas = @capture(video, size)
      #Filter canvas
      $filter = $('input[name="filter"]:checked')
      if $filter.val()
        Filter[$filter.val()](canvas)
      $(canvas).data("currentTime", currentTime).prependTo $("#output")

    preview: (currentTime) ->
      $preview = $(".preview")
      size =
        width: $preview.width()
        height: $preview.height()

      bgVideo = $("#backgroundVideo")[0]
      bgVideo.currentTime = currentTime
      $preview.empty().show()


      #capture while seeked
      @deferred = $.Deferred()
      @deferred.done =>
        output = $("#output")
        canvas = @capture(bgVideo, size)
        $filter = $('input[name="filter"]:checked')
        if $filter.val()
          Filter[$filter.val()](canvas)

        $preview.append $(canvas).hide()
        $(canvas).fadeIn( "fast")

  $(document).ready ->
    #create a video in background, just for preview capture.
    $backgroundVideo = $("#video").clone().attr(
      loop: false
      id: "backgroundVideo"
    ).appendTo("#bg")
    Video.backgroundVideo = $backgroundVideo[0]
    #mute
    Video.backgroundVideo.muted = true
    #preloading video
    Video.backgroundVideo.load()
    #seeked event will be triggered after currentTime changed
    $backgroundVideo.bind "seeked", ->
      #resolve Deferred
      if not Video.deferred.isResolved()
        Video.deferred.resolve()

  Video
