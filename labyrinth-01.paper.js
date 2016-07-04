// WIP
// http://sketch.paperjs.org/#S/rVffb9owEP5XLKapSYEsdO0msdKXanuYtmlSJ+0BEHITAxnBRk6gsDb/+86/EjsJbdctLyG+u+++O/uzzX2H4jXpDDs3K5JHy06vE7FYfO8wR/kyiVaUZBkaocG7CRVjWc7ZivxM4nwJo5VHHxmH5DcBy3lo/DHP4ZuSO/SdJTT3hMObsx5Sb1+7HdZrkvODwORbMqFqOMW3Bw5BkGtCETxjC2jQQ6GvhnvWcNhDg+cP94+gHBsHmP4R+NZxC2YqqprQ+ZZGecIo2pH9D3bNGI8zD3776F75icKjLeeEisZ5qoOnVa81XCQjwWOsnac6nOyDOeMfcbT0TC6BT1JfJ5DROkEXMkhjS4YqS7DZZktPx2hrod+c5FtOteOEFk6NHNOYrb9t4wVBnlMhB+Zfcb4MlIun0ZI58ji6RGFwdlH6W2laO1vUY58ItdZCI/T9E7H9Zt42fLkY3F5QskAeFa0oM5hI2Z9TCKrHgCR080op9JR7DyU0tlaN/IKeqvfrSjpBSugiX1Z1qmwjoclFBTuWgVO/rfo5TjPilCxmcGap00qXpUlEzHTOrPGNNMg00EJdhu+yV+buWx8qmLWX8CgkVKRgfdFGw5RF0XaTkFiIZdomMqmxIEoZLZmDhEAZ4JWAHaCBAvxocPqAkkv4Ba9u12mdCFXCsqPGybRVg9Kzsohp0tbggC6BAHp4QNXIldw9nXzt02VNWR1338DdvxjXbvLMzGVF91SdCt0qk0vJhI5djOnfEzmGVJ4rTdlWk1MXH95s0ufKryEIo9yjkZUgq7g28dn8muzr5AWPmOM7c+TCDuupgHuUkcUaup8NnaOnSm5OL3XGX7OU8SE6uU1xtDpxbZ9hmwMTZ1sa10zyajC0P0rakEBQEzrLiGTmG8p3OF39P8qvCCH/whhuM+c2a8GuznrD2S8S5QGGtbIjX/CB8GDDskSunK594RmE4rwJw7JYI5DQvfvM5jhJ1bC1CBec3VlHp7tRgqQGfutmP8kFtN7q7WNYss9fslwnectineRmFZsySqrKJDOVrOWJP09hGr3GVgqXQahHy6p1+1eIJWp7ATO7gvI86GkSvs1N1nNEfeaxc8zqWlQwBSKwH7lli8eZ2G63brabpub+Cl3AMmkC2WBAw9r+Kp/CYWR65VJrrckqyQou6psho584/FXwyE5cAQ1idUqOQnEUnoXNk1CsYM+9Mcllr6WNRo9qW+4YnKzZjtzoCM824Tguxw2ktkvZtodK05HQAv4F3XKCVxsh36wzHE+LPw==

var thickness = 16
var strokeWidth = thickness - 6
var size = 40
var start = new Point(size/2, size/2)
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

project.activeLayer.position += new Point(100, 100)

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
