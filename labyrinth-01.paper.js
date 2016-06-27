// WIP
// http://sketch.paperjs.org/#S/dVLLboMwEPyVFZdACxGp2kuknPIDlVqph5CDY7YCQdZ0bZJKEf/eNcQlkdo9WPbszOxDvkSkjhito7cGna6iNNKm9O+CToqBTYewKQgkdkB4hldTk4tXKeTJBKc3cJ7C6g84+5+eBf5+KuiqWjeE1sIGVnlBBX32pF1tCE74/W62xnBpY7kncJmUXqZ7ZiQnotn96UX85UhuaKNaWKJfHlUXB3NviG1ydfQRHB9HMrbwMPc2sxhdzxTIEz5cC4bcWLOgwQ/jm+iUq6YWfsfxa05CvmR1DoMINfZ8SXp4qVtjcUQDYh2bBremNSyixaFVulnc5T7qciw4rzaD53u16rzWfvWKUcTyCw6Mqun8Hm203u2HHw==

var rope =
    [ new Point(1, 0)
    , new Point(0, 1)
    , new Point(-1, 0)
    , new Point(0, -1)
    ]
var thickness = 10

function vexToCoords(vex) {
    var current = new Point(250, 250)
    var coords = vex.map(function(vexel){
        current += vexel * thickness
        return current
    })
    return coords
}

var path = vexToCoords(rope)

var draw = new Path(path)
draw.closePath()
draw.strokeColor = 'black'
draw.strokeWidth = thickness - 4
draw.strokeCap = 'square'
