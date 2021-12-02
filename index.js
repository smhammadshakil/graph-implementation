
// Test graph: AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7
const testGraph = ['AB5', 'BC4', 'CD8', 'DC8', 'DE6', 'AD5', 'CE2', 'EB3', 'AE7']

class Graph {
    constructor() {
    this.AdjList = new Map()
    this.AdjListDistance = new Map()
    this.allPaths = {}
    this.allPathsDis = {}
    }
    
    // BASIC METHODS
    addVertex(vertex) {
    if (!this.AdjList.has(vertex)) {
        this.AdjList.set(vertex, [])
        this.AdjListDistance.set(vertex, [])
    } else {
        throw 'Already Exist!!'
    }
    }
    
    addEdge(vertex, node, dis) {
    if (this.AdjList.has(vertex)) {
        if (this.AdjList.has(node)){
        let arr = this.AdjList.get(vertex)
        let arrDis = this.AdjListDistance.get(vertex)
        if(!arr.includes(node)){
            arr.push(node)
            arrDis.push(dis)
        }
        }else {
        throw `Can't add non-existing vertex ->'${node}'`
        }
    } else {
        throw `You should add '${vertex}' first`
    }
    }
    
    print() {
    for (let [key, value] of this.AdjList) {
        console.log(key, value, this.AdjListDistance.get(key))
    }
    }
    
    calculateDistance(route) {
    const vertex = route.split('-')
    let distance = 0
    while(vertex.length - 1) {
        const ver = vertex.shift()
        const nextL = this.AdjList.get(ver)
        const index = nextL.indexOf(vertex[0])
        if (index !== -1) {
        distance = distance + this.AdjListDistance.get(ver)[index]
        } else {
        distance = 0
        break;
        }
    }
    return distance ? distance : 'NO SUCH ROUTE'
    }
            
    getAllSource(destId){
    var source = []
    for (let [key, value] of this.AdjList) {
        if (value.includes(destId)){
        source.push(key)
        }
    }
    return source
    }

    findAllPaths(destination, end, options){
    let sourceId =  this.getAllSource(destination[destination.length - 1])
    const cycle = sourceId.find(ele => ele === end)

    if(sourceId.length === 0 || destination.length > options.limit){
        const des = destination.slice()
        this.allPaths[des.reverse().join('-')] = des
        return;
    }

    if (cycle) {
        let des = destination.slice()
        des = des.concat(cycle)
        this.allPaths[des.reverse().join('-')] = des
    }

    for(var i=0; i < sourceId.length; i++){
        var copy  = destination.slice(0)
        copy.push(sourceId[i])
        this.findAllPaths(copy, end, options)
    }
    }

    getDistanceForCurrentRoute(route) {
    let des = route.slice().reverse().join('-')
    return this.calculateDistance(des)
    }

    findAllPathsWithDis(destination, end, options){
    let sourceId =  this.getAllSource(destination[destination.length - 1])
    const cycle = sourceId.find(ele => ele === end)

    const distance = destination.length > 1 ? this.getDistanceForCurrentRoute(destination) : null
    if(sourceId.length === 0 || ( distance &&  distance > options.distance)){
        const des = destination.slice()
        this.allPathsDis[des.reverse().join('-')] = distance
        return;
    }

    if (cycle) {
        let des = destination.slice()
        des = des.concat(cycle)
        const distance = this.getDistanceForCurrentRoute(des)
        this.allPathsDis[des.reverse().join('-')] = distance
    }

    for(var i=0; i < sourceId.length; i++){
        var copy  = destination.slice(0)
        copy.push(sourceId[i])
        this.findAllPathsWithDis(copy, end, options)
    }
    }
    
    findPathsWithDis(start, des, distance) {
    this.findAllPathsWithDis([des], des, { distance })
    const paths = []
    Object.keys(this.allPathsDis).forEach(ele => {
        const path = ele.split('-')
        const first = path[0]
        if (first === start && this.allPathsDis[ele] < distance) {
        paths.push(this.allPathsDis[ele])
        }
    })
    return paths.length
    }

    findExactPaths(start, des, count) {
    this.findAllPaths([des], des,{ limit: count })
    const paths = []
    Object.keys(this.allPaths).forEach(ele => {
        const path = ele.split('-')
        const first = path[0]
        const last = path[path.length - 1]
        if (first === start && last === des && path.length === count + 1) {
        paths.push(this.allPaths[ele])
        }
    })
    return paths.length
    }

    findPathsWithUpToStops(start, des, count) {
    this.findAllPaths([des], des,{ limit: count })
    const paths = []
    Object.keys(this.allPaths).forEach(ele => {
        const path = ele.split('-')
        const first = path[0]
        const last = path[path.length - 1]
        if (first === start && last === des && path.length <= count + 1) {
        paths.push(this.allPaths[ele])
        }
    })
    return paths.length
    }

    findShortestDis(start, des) {
    const count = this.AdjList.size
    this.findAllPaths([des], des,{ limit: count })
    let distances = {}
    Object.keys(this.allPaths).forEach(ele => {
        const path = ele.split('-')
        const first = path[0]
        const last = path[path.length - 1]
        if (first === start && last === des && path.length <= count + 1) {
        distances[this.calculateDistance(this.allPaths[ele].join('-'))] = 1
        }
    })
    distances = Object.keys(distances)
    return distances.length ? distances[0] : 'NO SUCH ROUTE'
    }

}
function main() {
    let g = new Graph()
    let arr = ['A', 'B', 'C', 'D', 'E']
    for (let i = 0; i < arr.length; i++) {
    g.addVertex(arr[i])
    }
    // Test graph: AB5, BC4, CD8, DC8, DE6, AD5, CE2, EB3, AE7
    g.addEdge('A', 'B', 5)
    g.addEdge('B', 'C', 4)
    g.addEdge('C', 'D', 8)
    g.addEdge('D', 'C', 8)
    g.addEdge('D', 'E', 6)
    g.addEdge('A', 'D', 5)
    g.addEdge('C', 'E', 2)
    g.addEdge('E', 'B', 3)
    g.addEdge('A', 'E', 7)

    // print data in console
    g.print()
    document.write('<h6>- - - - - - -', '</h6>')
    document.write('<h6>Test Graph: ',testGraph, '</h6>')
    document.write('<h6>- - - - - - -', '</h6>')
    // Q1
    document.write('<span>Q1: <b>', g.calculateDistance('A-B-C'), '</b> </span>')
    // Q2
    document.write('<span>Q2: <b>', g.calculateDistance('A-D'), '</b> </span>')
    // Q3
    document.write('<span>Q3: <b>', g.calculateDistance('A-D-C'), '</b> </span>')
    // Q4
    document.write('<span>Q4: <b>', g.calculateDistance('A-E-B-C-D'), '</b> </span>')
    // Q5
    document.write('<span>Q5: <b>', g.calculateDistance('A-E-D'), '</b> </span>')
    // Q6
    document.write('<span>Q6: <b>', g.findPathsWithUpToStops('C', 'C', 3), '</b> </span>')
    // Q7
    document.write('<span>Q7: <b>', g.findExactPaths('A', 'C', 4), '</b> </span>')
    // Q8
    document.write('<span>Q8: <b>', g.findShortestDis('A', 'C'), '</b> </span>')
    // Q9
    document.write('<span>Q9: <b>', g.findShortestDis('B', 'B'), '</b> </span>')
    // Q10
    document.write('<span>Q10: <b>', g.findPathsWithDis('C', 'C', 30), '</b> </span>')

    document.write('<h6>- - - - - - -', '</h6>')
    return g
}
const graph = main()
function calDistance() {
    const value = document.getElementById('path').value
    document.getElementById('result1').innerHTML = graph.calculateDistance(value)
}
function calRoutesWithMaxRoute() {
    const start = document.getElementById('start1').value
    const end = document.getElementById('end1').value
    const stops = document.getElementById('stops1').value
    document.getElementById('result2').innerHTML = graph.findPathsWithUpToStops(start, end, +stops)
}
function calRoutesWithExactRoute() {
    const start = document.getElementById('start2').value
    const end = document.getElementById('end2').value
    const stops = document.getElementById('stops2').value
    document.getElementById('result3').innerHTML = graph.findExactPaths(start, end, +stops)
}
function calShortDis() {
    const start = document.getElementById('start3').value
    const end = document.getElementById('end3').value
    document.getElementById('result4').innerHTML = graph.findShortestDis(start, end)

}
function noOfRoutes() {
    const start = document.getElementById('start4').value
    const end = document.getElementById('end4').value
    const dis = document.getElementById('distance').value
    document.getElementById('result5').innerHTML = graph.findPathsWithDis(start, end, +dis)

}
