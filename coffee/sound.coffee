define ->
  Sound =
    cameraShot: ->
      soundManager.createSound("camera-click", "sound/camera_click.ogg").play()

  Sound
