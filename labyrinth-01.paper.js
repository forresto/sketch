// WIP
// http://sketch.paperjs.org/#S/fVRNj5swEP0rIy4LLUHJqqtKUfe06rFVpa3aQ7IHx54UC2NT22S3ivjvtQEHTNpwQPD83ny8GTgnktSYbJPnCi0tkzyhivn3E9FwUK1kBh5hs95LD9iS00qimWNaNQiPewnu2oHEV/imuLTpJod1NsD5DF7nsPkHvPo/fRX4L0NC2bJf6CvYOWAvj62klisJJ3z7rp6U0syk7jmD8yDzGtpqjdI60RT6/sEFd7dsRuvVjuX0RU2aNAT3AVFkY0R/hYjvezIKeDe5M7E02lbLQB7wbkwYzvqce9lFzWgimaq/+lYhFSijbrSr8AuxZTGw0lkHp+GRHyHV8AnWxf3DRdpzIgtmpneAwuBMeEs3G+KV7uMt4eo644J7PfZu6o6Hxo/CuZZGHrgBeJ8ib89cMnzbAs/dkKhVegunbmk1Nz+I4Gz0ehxVPqxZZLuitG04snH1AlyqGpfuhB7HaMVR6c+Elpd9gvQUuTRtRlwbaRrx53ZlS0lNKny2xDqF/zRHulnyfeWN829Y9suH4yVZOGeavIbOHDX1fHfo4YIKZbBHA2KsVhU+KaH8ft4dBKHVXXT2k7M+4fQbWcGHWE0arzW/W6LRid3/6KCRVI031iTb3Uv3Fw==

var bounds = 10
var thickness = 10
var rope =
    [ new Point(1, 0)
    , new Point(0, 1)
    , new Point(-1, 0)
    , new Point(0, -1)
    ]
var nudges = []

function vexToCoords(vex) {
    var current = new Point(250, 250)
    var coords = vex.map(function(vexel){
        current += vexel * thickness
        return current
    })
    return coords
}

function randomNudge (len) {
    var r = Math.random()
    var v
    if (r < 0.25) {
        v = new Point(1, 0)
    } else if (r < 0.5) {
        v = new Point(0, 1)
    } else if (r < 0.75) {
        v = new Point(-1, 0)
    } else {
        v = Point(0, -1)
    }
    var i = Math.floor(Math.random() * len)
    return {index: i, vector: v}
}

function isValidNudge (current, nudge) {
    var occupied = []
    var home = new Point(0, 0)
    current.forEach(function (v) {
        
    })
}

function applyNudge (current, nudge) {
    
}

function makeState (rope, nudges) {
    
}

var path = vexToCoords(rope)

var draw = new Path(path)
draw.closePath()
draw.strokeColor = 'black'
draw.strokeWidth = thickness - 4
draw.strokeCap = 'square'
