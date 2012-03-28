define ->
  Filters = {}
  Filters.getPixels = (img) ->
    c = @getCanvas(img.width, img.height)
    ctx = c.getContext("2d")
    ctx.drawImage img
    ctx.getImageData 0, 0, c.width, c.height

  Filters.getPixelsFromCanvas = (c) ->
    ctx = c.getContext("2d")
    ctx.getImageData 0, 0, c.width, c.height

  Filters.getCanvas = (w, h) ->
    c = document.createElement("canvas")
    c.width = w
    c.height = h
    c

  Filters.grayscale = (canvas, args) ->
    pixels = @getPixelsFromCanvas(canvas)
    d = pixels.data
    i = 0

    while i < d.length
      r = d[i]
      g = d[i + 1]
      b = d[i + 2]
      # CIE luminance for the RGB
      # The human eye is bad at seeing red and blue, so we de-emphasize them.
      v = 0.2126 * r + 0.7152 * g + 0.0722 * b
      d[i] = d[i + 1] = d[i + 2] = v
      i += 4
    ctx = canvas.getContext("2d")
    ctx.putImageData pixels, 0, 0
    canvas

  Filters.brightness = (canvas, adjustment) ->
    adjustment = adjustment or 30
    pixels = @getPixelsFromCanvas(canvas)
    d = pixels.data
    i = 0

    while i < d.length
      d[i] += adjustment
      d[i + 1] += adjustment
      d[i + 2] += adjustment
      i += 4
    ctx = canvas.getContext("2d")
    ctx.putImageData pixels, 0, 0
    canvas

  Filters.threshold = (canvas, threshold) ->
    threshold = threshold or 128
    pixels = @getPixelsFromCanvas(canvas)
    d = pixels.data
    i = 0

    while i < d.length
      r = d[i]
      g = d[i + 1]
      b = d[i + 2]
      v = (if (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold) then 255 else 0)
      d[i] = d[i + 1] = d[i + 2] = v
      i += 4
    ctx = canvas.getContext("2d")
    ctx.putImageData pixels, 0, 0
    canvas

  Filters.tmpCanvas = document.createElement("canvas")
  Filters.tmpCtx = Filters.tmpCanvas.getContext("2d")
  Filters.createImageData = (w, h) ->
    @tmpCtx.createImageData w, h

  Filters.convolute = (canvas, weights, opaque) ->
    pixels = @getPixelsFromCanvas(canvas)
    side = Math.round(Math.sqrt(weights.length))
    halfSide = Math.floor(side / 2)
    src = pixels.data
    sw = pixels.width
    sh = pixels.height
    w = sw
    h = sh
    output = Filters.createImageData(w, h)
    dst = output.data
    alphaFac = (if opaque then 1 else 0)
    y = 0

    while y < h
      x = 0

      while x < w
        sy = y
        sx = x
        dstOff = (y * w + x) * 4
        r = 0
        g = 0
        b = 0
        a = 0
        cy = 0

        while cy < side
          cx = 0

          while cx < side
            scy = sy + cy - halfSide
            scx = sx + cx - halfSide
            if scy >= 0 and scy < sh and scx >= 0 and scx < sw
              srcOff = (scy * sw + scx) * 4
              wt = weights[cy * side + cx]
              r += src[srcOff] * wt
              g += src[srcOff + 1] * wt
              b += src[srcOff + 2] * wt
              a += src[srcOff + 3] * wt
            cx++
          cy++
        dst[dstOff] = r
        dst[dstOff + 1] = g
        dst[dstOff + 2] = b
        dst[dstOff + 3] = a + alphaFac * (255 - a)
        x++
      y++
    output

  Filters.sharpen = (canvas) ->
    @convolute canvas, [ 0, -1, 0, -1, 5, -1, 0, -1, 0 ]

  Filters.blur = (canvas) ->
    @convolute canvas, [ 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9 ]

  Filters
