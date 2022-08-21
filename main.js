var imageLoader = document.getElementById('imageLoader')
imageLoader.addEventListener('change', (e) => {
  handleImage(e.target.files[0])
}, false)
var canvas = document.getElementById('imageCanvas')
var ctx = canvas.getContext('2d')
// new image size (resize)
const newImageWidth = 1000
// polaroid frame settings
const frame = {
  width: 40,
  bottomMargin: 130,
  color: 'white',
  shadow: {
    color: '#c1c1c1',
    blur: 15,
    offset: 10
  }
}

function handleImage (rawImage) {
  var reader = new FileReader()
  reader.onload = function (event) {
    var img = new Image()
    img.onload = function () {
      // calculate shadow margin
      const shadowMargin = frame.shadow.offset * 2

      // calculate new image size
      const ratio = newImageWidth / img.width
      const newImageHeight = img.height * ratio

      // setup canvas size
      canvas.width = newImageWidth + (frame.width * 2) + (shadowMargin * 2)
      canvas.height = newImageHeight + (frame.width * 2) + frame.bottomMargin + (shadowMargin * 2)

      // reset canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.save()

      // set shadow settings
      ctx.shadowColor = frame.shadow.color
      ctx.shadowBlur = frame.shadow.blur

      // draw shadow right-under
      ctx.shadowOffsetX = frame.shadow.offset / 2
      ctx.shadowOffsetY = frame.shadow.offset / 2
      ctx.fillStyle = frame.shadow.color
      ctx.fillRect(
        shadowMargin,
        shadowMargin,
        canvas.width - (shadowMargin * 2),
        canvas.height - (shadowMargin * 2)
      )

      // draw shadow left-upper
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 0
      ctx.globalAlpha = 0.3
      ctx.fillRect(
        shadowMargin,
        shadowMargin,
        canvas.width - (shadowMargin * 2),
        canvas.height - (shadowMargin * 2)
      )

      // reset shadow for frame/image
      ctx.restore()

      // draw frame
      ctx.fillStyle = frame.color
      ctx.strokeStyle = frame.shadow.color
      ctx.fillRect(
        shadowMargin,
        shadowMargin,
        canvas.width - (shadowMargin * 2),
        canvas.height - (shadowMargin * 2)
      )

      // draw image
      ctx.drawImage(
        img,
        frame.width + shadowMargin,
        frame.width + shadowMargin,
        newImageWidth,
        newImageHeight
      )
      ctx.fillStyle = "black"
      ctx.font = '200% "Shadows Into Light"'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'hanging'
      exifr.parse(rawImage)
      .then(output => 
        {
          console.log(output)
          ctx.fillText(output.Make + " " + output.Model+ " " + output.LensModel, (newImageWidth + (frame.width * 2) + (shadowMargin * 2)) / 2, newImageHeight + (frame.width * 2) + frame.bottomMargin / 2 - shadowMargin)
          if(output.ExposureTime>=1) ctx.fillText(output.FocalLength + "mm f/" + output.FNumber  + " " + output.ExposureTime + '" ISO ' + output.ISO, (newImageWidth + (frame.width * 2) + (shadowMargin * 2)) / 2, newImageHeight + (frame.width * 2) + frame.bottomMargin / 2 + shadowMargin)
          else ctx.fillText(output.FocalLength + "mm f/" + output.FNumber  + " 1/" + parseInt(1/output.ExposureTime) + " ISO " + output.ISO, (newImageWidth + (frame.width * 2) + (shadowMargin * 2)) / 2, newImageHeight + (frame.width * 2) + frame.bottomMargin / 2 + shadowMargin)
        })
    }
    img.src = event.target.result
  }
  reader.readAsDataURL(rawImage)
}

var lastTarget = null

function isFile (evt) {
  var dt = evt.dataTransfer

  for (var i = 0; i < dt.types.length; i++) {
    if (dt.types[i] === 'Files') {
      return true
    }
  }
  return false
}

window.addEventListener('dragenter', function (e) {
  if (isFile(e)) {
    lastTarget = e.target
    document.querySelector('#dropzone').style.visibility = ''
    document.querySelector('#dropzone').style.opacity = 1
    document.querySelector('#textnode').style.fontSize = '48px'
  }
})

window.addEventListener('dragleave', function (e) {
  e.preventDefault()
  if (e.target === document || e.target === lastTarget) {
    document.querySelector('#dropzone').style.visibility = 'hidden'
    document.querySelector('#dropzone').style.opacity = 0
    document.querySelector('#textnode').style.fontSize = '42px'
  }
})

window.addEventListener('dragover', function (e) {
  e.preventDefault()
})

window.addEventListener('drop', function (e) {
  e.preventDefault()
  document.querySelector('#dropzone').style.visibility = 'hidden'
  document.querySelector('#dropzone').style.opacity = 0
  document.querySelector('#textnode').style.fontSize = '42px'
  if (e.dataTransfer.files.length === 1) {
    // do something with file
    handleImage(e.dataTransfer.files[0])
  }
})
