(function() {

  define(function() {
    var Filters;
    Filters = {};
    Filters.getPixels = function(img) {
      var c, ctx;
      c = this.getCanvas(img.width, img.height);
      ctx = c.getContext("2d");
      ctx.drawImage(img);
      return ctx.getImageData(0, 0, c.width, c.height);
    };
    Filters.getPixelsFromCanvas = function(c) {
      var ctx;
      ctx = c.getContext("2d");
      return ctx.getImageData(0, 0, c.width, c.height);
    };
    Filters.getCanvas = function(w, h) {
      var c;
      c = document.createElement("canvas");
      c.width = w;
      c.height = h;
      return c;
    };
    Filters.grayscale = function(canvas, args) {
      var b, ctx, d, g, i, pixels, r, v;
      pixels = this.getPixelsFromCanvas(canvas);
      d = pixels.data;
      i = 0;
      while (i < d.length) {
        r = d[i];
        g = d[i + 1];
        b = d[i + 2];
        v = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        d[i] = d[i + 1] = d[i + 2] = v;
        i += 4;
      }
      ctx = canvas.getContext("2d");
      ctx.putImageData(pixels, 0, 0);
      return canvas;
    };
    Filters.brightness = function(canvas, adjustment) {
      var ctx, d, i, pixels;
      adjustment = adjustment || 30;
      pixels = this.getPixelsFromCanvas(canvas);
      d = pixels.data;
      i = 0;
      while (i < d.length) {
        d[i] += adjustment;
        d[i + 1] += adjustment;
        d[i + 2] += adjustment;
        i += 4;
      }
      ctx = canvas.getContext("2d");
      ctx.putImageData(pixels, 0, 0);
      return canvas;
    };
    Filters.threshold = function(canvas, threshold) {
      var b, ctx, d, g, i, pixels, r, v;
      threshold = threshold || 128;
      pixels = this.getPixelsFromCanvas(canvas);
      d = pixels.data;
      i = 0;
      while (i < d.length) {
        r = d[i];
        g = d[i + 1];
        b = d[i + 2];
        v = (0.2126 * r + 0.7152 * g + 0.0722 * b >= threshold ? 255 : 0);
        d[i] = d[i + 1] = d[i + 2] = v;
        i += 4;
      }
      ctx = canvas.getContext("2d");
      ctx.putImageData(pixels, 0, 0);
      return canvas;
    };
    Filters.tmpCanvas = document.createElement("canvas");
    Filters.tmpCtx = Filters.tmpCanvas.getContext("2d");
    Filters.createImageData = function(w, h) {
      return this.tmpCtx.createImageData(w, h);
    };
    Filters.convolute = function(canvas, weights, opaque) {
      var a, alphaFac, b, cx, cy, dst, dstOff, g, h, halfSide, output, pixels, r, scx, scy, sh, side, src, srcOff, sw, sx, sy, w, wt, x, y;
      pixels = this.getPixelsFromCanvas(canvas);
      side = Math.round(Math.sqrt(weights.length));
      halfSide = Math.floor(side / 2);
      src = pixels.data;
      sw = pixels.width;
      sh = pixels.height;
      w = sw;
      h = sh;
      output = Filters.createImageData(w, h);
      dst = output.data;
      alphaFac = (opaque ? 1 : 0);
      y = 0;
      while (y < h) {
        x = 0;
        while (x < w) {
          sy = y;
          sx = x;
          dstOff = (y * w + x) * 4;
          r = 0;
          g = 0;
          b = 0;
          a = 0;
          cy = 0;
          while (cy < side) {
            cx = 0;
            while (cx < side) {
              scy = sy + cy - halfSide;
              scx = sx + cx - halfSide;
              if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                srcOff = (scy * sw + scx) * 4;
                wt = weights[cy * side + cx];
                r += src[srcOff] * wt;
                g += src[srcOff + 1] * wt;
                b += src[srcOff + 2] * wt;
                a += src[srcOff + 3] * wt;
              }
              cx++;
            }
            cy++;
          }
          dst[dstOff] = r;
          dst[dstOff + 1] = g;
          dst[dstOff + 2] = b;
          dst[dstOff + 3] = a + alphaFac * (255 - a);
          x++;
        }
        y++;
      }
      return output;
    };
    Filters.sharpen = function(canvas) {
      return this.convolute(canvas, [0, -1, 0, -1, 5, -1, 0, -1, 0]);
    };
    Filters.blur = function(canvas) {
      return this.convolute(canvas, [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9]);
    };
    return Filters;
  });

}).call(this);
