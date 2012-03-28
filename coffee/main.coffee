require [
  "module"
  "javascript/capture.js"
  "javascript/sound.js"
], (module, video, sound) ->
  flashIt = ->
    $(".flash").css("opacity", 0.5).show().animate
      opacity: 0
    , 100, ->
      $(@).hide()

  captureSt = null
  $("#control").on("click", ->
    if $(@).hasClass("play")
      $("#video")[0].play()
      $(@).removeClass().addClass "shot"
    else if $(@).hasClass("shot")
      flashIt()
      video.shoot()
      sound.cameraShot()
      event.stopPropagation()
  ).on "mousedown touchstart", ->
    if $(@).hasClass("shot")
      captureSt = setInterval(->
        flashIt()
        video.shoot()
        sound.cameraShot()
      , 100)

  $("#output canvas").live "click", ->
    currentTime = $(@).data("currentTime")
    video.preview currentTime

  $(".preview").live "click", ->
    $(@).fadeOut "fast"

  $(document).on "mouseup touchend", ->
    clearInterval captureSt

  $("#control").on "dblclick", (event) ->
    event.preventDefault()

  $("#device").draggable
    axis: "x"
    containment: "parent"

