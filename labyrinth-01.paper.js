// WIP
// http://sketch.paperjs.org/#S/nVZbb9owFP4rFlLVUCALtNMkVvpSbQ/TNk3qpD0AQm5iICPYkeNQaMt/3zmOkzgX2q48QDiX73w+N+epw+mWdcaduw1T/rrT7/giwP87Kolah/6GsyQhEzL0ZhxliaJSwX/OHsgvEXLljLw+GXldow4fGWivwDoTRPT+IMFsTSYzTuAztVyHfYKOKO5bYgAcvl08OIFySg4wgxPwrXILZo6nmvFlyn0VCk52bP9b3Aohg8SB5y55yuzw4H4qJeOYKifL2UWZTwPna0+wmBrjuXFne3cp5Bfqr508FuKzqGsCaG8ToAcRtLIlQhnFjdNk7Rgfoz2aX8lUKrkxnPFj5YyS8kBsf6bBihGnckIJzH9QtXYzE8eghUviSHJNPHf0sbC3wrRm9lj3fcXV6oWG66dXfAfNuG34uhmqueBsRRyOqSgi5J46PxfgVPdR8mCSV4xCPzPvk5AHVtfgCbQET0GenzM1uSlnyI0YX8EoDchl2xGXNEpYIykZtQmO7KrkMNXg8+7bcLDcC2uULUpJFPosr/3CksdaocNAvs2ZX7brXWaWQDSz7mIqcwLC99M4ZAEOzLxt0PScuX4keEEIxgimA6xC0AM0JBAeFvWMfibhNTzBT69XyQi6ZsNle03DeescastSg9k3WveQF7UU3OhtWQnXXgSrEHXYfR12/25YnSXdcROL5EW20ntlgCqRvCh5P/132BoABFcyZW3TWea/PmM0jqO3TlmjlfMBPelZjlLp1zY2Nr8m+zp55BFI+pDfpbBInczhiSRstYVcJ+PKDVMGzy+pREmxYbciEnJMzu8j6m/Oq7pvsM1AJUXKg5rqTxio9di65AfkqiAOIZAcDlPCNDc9irEUf5mvXAp537Hv9MCkG4sk1FXo2W8FQw9XtOd187PmreVVKreS4sG6VnIjswd7sOTJWWP/AYJCSLPZ7CtK01TvqfFMtVR4poqWKajpK28ZQU2cxh75MOoCadNwZ809U0FsZ7iwKRaLsG8ImNIbsif6ET829qLemTOFLYhf1TkS/KuE10GH7fAlIYcsd+jEw0U59Jp7EuvoVO9U/TpoGplMXuxk3WqSbcWO3RkPx1bRICjkOSRezvC6ei8Z3cTYcklnPJ0f/wE=

var thickness = 10
var start = new Point(20, 20)
var size = 40

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
    if (index < 0 || index > labyrinth.length - 3) {
        return false
    }
    if (nudge == neg(labyrinth[index])) {
        return false
    }
    var _labyrinth = labyrinth.slice()
    _labyrinth.splice(index, 0, nudge)
    _labyrinth.splice(index+3, 0, neg(nudge))

    var occupied = []
    var current = start.clone()
    for (var i = 0, len = _labyrinth.length; i<len; i++) {
        var vexel = _labyrinth[i]
        current += vexel
        if (current.y < 0 || current.y > size) {
            return false
        }
        if (current.x < 0 || current.x > size) {
            return false
        }
        var index = current.y * size + current.x
        if (occupied[index]) {
            return false
        }
        occupied[index] = true
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
    , strokeWidth: thickness - 4
    }
)
draw.closePath()

project.activeLayer.position += new Point(100, 100)

var index = 0

function grow () {
    index = (index + 1) % labyrinth.length
	var nudge = randomNudge()
	var _labyrinth = tryNudge(labyrinth, nudge, index)
	if (_labyrinth) {
	    var _index = (Math.floor(_labyrinth.length/2) + index) % _labyrinth.length
	    var __labyrinth = tryNudge(_labyrinth, neg(nudge), _index)
    	if (__labyrinth) {
            labyrinth = __labyrinth
    	}
	}
}

function onFrame(event) {
    for (var i=0; i<10; i++) {
        grow()
    }
    var segments = vexToCoords(labyrinth)
    draw.removeSegments()
    draw.addSegments(segments)
}
