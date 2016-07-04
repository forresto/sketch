// WIP
// http://sketch.paperjs.org/#S/rVffb9owEP5XLKapSQkssHaTWOlLtT1M2jSpk/YACKWJgYhgIycBupb/fedfiZ2YtuuWlxDf3Xffnf3Z5qFDog3ujDq3a1zEq07QiWnCv3cRQ8UqjdcE5zkao8GHKeFjecHoGv9Kk2IFo7VHD2mH9DcGy0Wo/SNWwDfBe/SDpqTwuMO7YYDkuzfwleP9ZoMLds9RWYmnRA5n0d09gzDINiUInokBNQhQ6MvhwBgOAzR4+XDvBMqpcYDpnYB3jhswM17VlCxKEhcpJWiHDz/pDaUsyT347aMH6ccLj0vGMOGt82QPz+tuK7hYRILHRDnPVDg+9BeUfY7iladzcXyc+SqBiFYJupBBGB0Z6iz9bZmvPBWjrEf1ZrgoGVGOU3K0amQRSejme5ksMfKsChkw/xYVq7508RRaukAeQ1co7A8vK38jjbOzx2bsM6HGWmiFfnwmttfO68IXi8HuBcFL5BHeiiqDjhT9OYegZgxIQjWvkkIg3QOUksRYNeILeirfb2vp9DNMlsWqrlNmG3NVLmvYiQic+a7qF1GWY6tkPoNzQ51GujxLY6ync26Mb4VBpIEWqjJ8m700d9/7UMHcXcKTkFCRhPV5GzVTGsflNsUJF8vMJTKhsX6cUVIxBwmBMsArBTtAAwX40eL0CaVX8Ate3a7VOh4qhWVGTdKZU4PCs7bwaVLW/j26AgLo8RHVI9di/7TyuafLmLIm7qGFe3g1rtnkuZ7Lmu65PBe6dSabkg6d2BizvydyCqk6V9qyrSenKb5ou81eKr+WILRyT0bWgqzjXOIz+bXZN8lzHgmL9vrQhR3WkwEPKMfLDXQ/H1lHT51cn17ylL+hGWUjdHaXRfH6zLZ9hW0OTIyWJGmYxOVgZH5UtCEBp8Z1lmPBzNeU91G2/n+U32CM/4Ux3GcuTNacnYu1XumhfYmZL6I0k8PGaloyujfOQHvHA20MfOeuPS04tNqzzfNU0Ches+6mhWPVTQu9HHUZFVVpEpkq1uLoXmQwH15rT3w39KEepQ/nPi4RK1R3AXOzgmpjDxQJ3+Qm6jkhI/2YOeZNUUmYI8Kwsdhl88ea2G63aTabJuf+Gl2God8GMsGAhrGP1T5Hi5HulU3NWZNRkhF8bO5qlHxhcOv38I7f5TRifdyNQ36mDcP2kcZXsGdffcSyVxpF4ydFKqTP8Ibu8K2K8ExTlCTVuIZUdqE/d6gwnQg9wh+aO4aj9ZbfyvLOaDI7/gE=

var thickness = 16
var strokeWidth = thickness - 6
var size = 40
var start = new Point(size/2, size/2-1)
var symmetry = true

var labyrinth =
    [ new Point(1, 0)
    , new Point(0, 1)
    , new Point(0, 1)
    , new Point(-1, 0)
    , new Point(-1, 0)
    , new Point(0, -1)
    , new Point(0, -1)
    , new Point(1, 0)
    ]


function vexToCoords(vex) {
    var current = (start * thickness)
    coords = [current]
    vex.forEach(function(vexel){
        current += (vexel * thickness)
        coords.push(current)
    })
    return coords
}

function randomNudge () {
    var r = Math.random()
    if (r < 0.25) {
        return new Point(1, 0)
    }
    if (r < 0.5) {
        return new Point(0, 1)
    }
    if (r < 0.75) {
        return new Point(-1, 0)
    }
    return new Point(0, -1)
}

function neg (nudge) {
    return nudge * -1
}

function tryNudge (labyrinth, nudge, index) {
    index = index % labyrinth.length
    if (nudge == neg(labyrinth[index])) {
        return false
    }
    var _labyrinth = labyrinth.slice()
    _labyrinth.splice(index, 0, nudge)
    index = (index+3) % _labyrinth.length
    _labyrinth.splice(index, 0, neg(nudge))

    var occupied = []
    var current = start.clone()
    for (var i = 0, len = _labyrinth.length; i<len; i++) {
        var vexel = _labyrinth[i]
        current += vexel
        if (current.y <= 0 || current.y > size) {
            return false
        }
        if (current.x <= 0 || current.x > size) {
            return false
        }
        var occupied_index = current.y * size + current.x
        if (occupied[occupied_index]) {
            return false
        }
        occupied[occupied_index] = true
    }
    return _labyrinth
}

function applyNudge (labyrinth, nudge, index) {
    var _labyrinth = tryNudge(labyrinth, nudge, index)
    if (_labyrinth) {
        return _labyrinth
    }
    return labyrinth
}

var draw = new Path(
    { segments: vexToCoords(labyrinth)
    , strokeColor: 'black'
    , strokeJoin: 'round'
    , strokeWidth: strokeWidth
    }
)
draw.closePath()

var walk = new Path(
    { segments: vexToCoords(labyrinth)
    , strokeColor: '#eee'
    , strokeJoin: 'round'
    , strokeWidth: strokeWidth - 4
    }
)
walk.closePath()

var index = 0
var symmetry_fail = 0

function grow () {
    index = (index + 1) % labyrinth.length
	var nudge = randomNudge()
	var _labyrinth = tryNudge(labyrinth, nudge, index)
	if (_labyrinth) {
	    if (symmetry) {
    	    var _index = (Math.floor(_labyrinth.length/2) + index) % _labyrinth.length
	        var __labyrinth = tryNudge(_labyrinth, neg(nudge), _index)
    	    if (__labyrinth) {
                labyrinth = __labyrinth
    	    } else {
    	        symmetry_fail++
    	        if (symmetry_fail > 500) {
    	            symmetry = false
    	        }
    	    }
	    } else {
            labyrinth = _labyrinth
	    }
	}
}

function onFrame(event) {
    for (var i=0; i<20; i++) {
        grow()
    }
    var segments = vexToCoords(labyrinth)
    draw.removeSegments()
    draw.addSegments(segments)
    walk.removeSegments()
    walk.addSegments(segments)
}
