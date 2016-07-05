// WIP
// http://sketch.paperjs.org/#S/nVftb+I2GP9XLKapoYQAvfUmsTJpV20fJm036SbtA0EoTQy4GBs5TmnX43/f47fETsJdb1RqiJ+3n593XgcsO+DBfPBpj2W+G8SDnBfq/SkTSO5Ivme4LNEC3fyQMnVWSsH3+B9SyB2czt7bU/IvVky3jikTEt4ZPqG/OGEy+iOTuyTHhEaKdXIzjJE+2lDOhTsbpszI0+zhRYAYmEgZgs/SUzWL0XRojmPveBqj2duPxxe0XDoHNeML6nvPPTUrdauUbSqWS8IZesLPf/N7uHZRRvB9iF4Nn7p4XgmBmXJdZHx43QTBqsu1JHAsV2gyWVqJldWBn5MNF79m+S5yBpURTIfWilZhrYzAjCb2mGlMJceq3EVWxlLP9imwrASzjCk7BxcVGSv44c+q2GIUBdcUAF+H37BEVhvZoEigOzRNbm5rfs9Mr3vPbdmviHoJ0RH98Suy467dPv06I0JfMLxFEVOuqC04Se2faxBqy0jxYp1X10Ns2GNEWOGljn4Dn5rn9039JBSzrdw19zTWFouGZamFVn0X32S0xB1X1SrgTlFHzdv0qCRYe1XuIS4pybHLiLV3ftQEbQaiYD0xDB1gyKN3Q3DCut8LX1QJNzJqdStySHmeV0eCC110fcWqazXJKWc1cqhCKC7gIkAH1QABvnQw/YTIHXyDx2gUuE6Jmtr0pZZk1VvGmrOhqDBZavKC7gAA+vwZNSc/64Yd2OsPlxeytt7njt7n/63Xd/LaxbKBe23my6ixFEJyostQx+rbgVzSBHCkqHBf5TfBaddvdjzSt1ZwpyBc8V+UbAqykesrPh9fF30bvPmbTNCHLN9vBa9YYUayyApSqbEDe0CQ2zPIXZUKKkRhGtdsj4btsWF7bGW7bp9qINwTkVMchWF7RTlEHYs5WhJ/VMWg0ntdhVKxxTy3zzZ1Qyi955SD2qvvMMZXIYOXFU3HP7sNpRDZyS04gNsCfkUl3h4AKxj1x3wTILcpQK8ocTH3siq2q1UPJAiHo/4OMwaIOjBXoaDeyeb+S03fZQU/OcUPFEJ7FdI+0ApI78PDj5tNieU8nG3e+KvXtVNG91h47gjD2ISvs9M4gy5S/nY5RrOpo/ux8vH7KFzfmDag1gUBkyzH5tirTUjtk7eUhPMDOs1s2DtGU6lU2wnoLziq7Rvit1ZxKntqOJV1U6ihRd7C3JkjsD0DattTemafos7ChrvuR7r2odbzMLZAhg6bBn2h86iPr3vd7kE2dKk8t3smZ78J+EES4Se1bHY6CVlM1cSc3XYHpopoFO5m+qeILUi0+GJFqnpOBD7wJ/zJSkQ+KSuK+typ9OnlgfO6DZikly9HDOmaZ/JQUToW/OB1GEjpLJcqn2Fh7Ywiq9n8bydyFB6MkPZVUmAqM6it26lKAA3KX3tMjSZHXhLt6IVh2WKpS/sXGap1Cyz8IHwQONsfFVM5mC9X5/8A

var thickness = 24
var strokeWidth = 16
var size = 25
var start = new Point(Math.ceil(size/2), Math.floor(size/2))

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
    coords = [] //[current]
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




// Background
var radius = 4
for (var i = 1; i <= size; i++) {
    for (var j = 1; j <= size; j++) {
        new Path.Circle(
            { center: [i * thickness, j * thickness]
            , radius: radius
            , fillColor: '#eee'
            }
        )
    }
}

var draw = new Path(
    { segments: vexToCoords(labyrinth)
    , closed: true
    , strokeColor: '#eee'
    // , strokeJoin: 'round'
    , strokeWidth: strokeWidth
    , shadowColor: 'black'
    , shadowBlur: 6
    , shadowOffset: new Point(0, 0)
    }
)

var walker = new Path.Circle(
    { center: start * thickness
    , radius: strokeWidth - 10
    , fillColor: 'black'
    }
)

var index = 0
var walk_distance = 0

function grow () {
    index = (index + 1) % labyrinth.length
	var nudge = randomNudge()
	var _labyrinth = tryNudge(labyrinth, nudge, index)
	if (_labyrinth) {
	    var _index = ((Math.floor(_labyrinth.length/2) + index) % _labyrinth.length) + 1
        var __labyrinth = tryNudge(_labyrinth, neg(nudge), _index)
	    if (__labyrinth) {
            labyrinth = __labyrinth
        }
	}
}

function onFrame(event) {
    for (var i=0; i<15; i++) {
        grow()
    }
    var segments = vexToCoords(labyrinth)
    draw.removeSegments()
    draw.addSegments(segments)
    draw.smooth(
        { type: 'catmull-rom'
        , factor: 0.5
        }
    )
    
    walk_distance = (walk_distance + event.delta * 50) % draw.length
    walker.position = draw.getPointAt(walk_distance)
}
