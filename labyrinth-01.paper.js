// WIP
// http://sketch.paperjs.org/#S/rVdtb9MwEP4rVhFasrQlHRugsu4Lgg9IIKQh8aGpqixx26ipXTnpG1v/O+e3xE7cbQzyJY3v7rnnzndn975D4hXuDDu3S1wmi063k9CUf29jhspFliwJLgo0QoN3EeFrRcnoEv/K0nIBq7VGgC6VQvYbg+Qy1PoxK+Gb4B36QTNSelzhzUUXybev1A6rFS7ZgWOyDY6IXM7juwMDI/AVEQTP2AAadFHoy+WusRx20cCx3DuhfmodYHouHEN9wmlGZLYhSZlRgrZ4/5N+opSlhQe/fXQv9XgkyYYxTHgmPJmS8zp5Ci4RlqAxVsoTZY73/Rlln+Nk4WlfHB/nvnIgrJWDADwIocND7aW/3hQLT9ko6VG9GS43jCjFiBytGFlMUrr6vknnGHlWhAyYf4vLRV+qeAotmyGPoWsU9i+uKn3DjTOzx6btE6bGnrdM3z9h22v7deGLYrBzQfAceYSnovKgLUV+zsGoaQM1rpJX1XZXqndRRlKjasQX5FS+X9e90M8xmZeLOk7pbTSqVcbCaOIKfBbnBW6lqoKAmLwWzPNweBFMjY41GBd5lmBdEVNjfS0Ewg3sgsqEbydAioO3PiRh6s7Co5AQkYT1+U5opjRJNusMp7zfJq4+FW3aT3JKKubQhdBcoJWBHKCBAvxocfqIsmv4Ba8gsFLHTWVvmlbjbOJsY6FZS/g2KWn/gK6BAHp4QPXKjZiolj/3dhlb1sTdt3D3L8Y1kzzVe1nTPZcnRVB7silp07GNMfl7IqeQqrPG0Fdg9eY0+zder/PndnCrIXTzn7SsG7K2czWfya/Nvkme80hZvNPHMAxpTxrcowLPV5D9YmidXrVzfQDKc/8TzSkborO7PE6WZ7bsK0xKEDG6IWlDJK4LQ/Ojog0OODXeZwUWzHxNeRfny/9H+RXG+F8Yox76YLLm7FysdaWH9sVmOouzXC4b1TRndGcco/bEg94Y+M7BH5UcWs1s80gWNMqX1F1UOqouKnU56jAqqlIkPFWsPXH8z3LYEK81FOGqBwGpBnEMci4daJcVtjuMqRlHNd67iopvMhRRnWgm/Zg+ps3WkjBHhGG82MHzx9reIGiKzdTJCrhBV2Hot4FMMKBhTLNa52gx0rmyqTljMkIyjI/N2UbJFwb/Bjy85ZdCjVgfeqOQn2wXYftg43Xs2XcoUfyqU9Ho0VYVA4DhFd3iW2XhmaI4Tat1DankogvdpkJ0wvQIf3TuGI6Xa369KzrD8eT4Bw==

var thickness = 16
var strokeWidth = thickness + 4
var size = 40
var start = new Point(size/2, size/2)
var symmetry = true

var labyrinth =
    [ new Point(1, 0)
    , new Point(0, 1)
    , new Point(-1, 0)
    , new Point(-1, 0)
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
    if (nudge == labyrinth[index]) {
        return false
    }
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
    , strokeWidth: strokeWidth - 8
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
    	    var _index = ((Math.floor(_labyrinth.length/2) + index) % _labyrinth.length) + 1
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
