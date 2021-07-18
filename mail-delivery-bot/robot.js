/**
 * Virtual mail robot that traverse path to deliver parcels in virtual world.
 * 
 * From Eloquent Javascript 3rd Edition Chapter 7
 */

//List of available roads
const roads = [
  "Alice's House-Bob's House",
  "Alice's House-Cabin",
  "Alice's House-Post Office",
  "Bob's House-Town Hall",
  "Daria's House-Ernie's House",
  "Daria's House-Town Hall",
  "Ernie's House-Grete's House",
  "Grete's House-Farm",
  "Grete's House-Shop",
  "Marketplace-Farm",
  "Marketplace-Post Office",
  "Marketplace-Shop",
  "Marketplace-Town Hall",
  "Shop-Town Hall",
];

//Map of source to list of targets
function buildGraph(edges) {
  let graph = Object.create(null);
  function addEdge(from, to) {
    if (graph[from] == null) {
      graph[from] = [to];
    } else {
      graph[from].push(to);
    }
  }

  for (let [from, to] of edges.map((r) => r.split("-"))) {
    addEdge(from, to);
    addEdge(to, from);
  }
  return graph;
}

const roadGraph = buildGraph(roads);

//World representation
class VillageState {
  constructor(place, parcels) {
    this.place = place; //Current location
    this.parcels = parcels; //Parcels to deliver
  }

  //Change location if param included in destination of current location
  move(destination) {
    if (!roadGraph[this.place].includes(destination)) {
      return this;
    } else {
      //Filter parcels that are not the destination of this location
      let parcels = this.parcels
        .map((p) => {
          if (p.place != this.place) return p;
          return { place: destination, address: p.address };
        })
        .filter((p) => p.place != p.address);
      return new VillageState(destination, parcels);
    }
  }
}


function greeting(state, robot) {
  console.log(String.raw`
  _                         _         
  |\/|  _. o |   | \  _  | o     _  ._     |_)  _ _|_ 
  |  | (_| | |   |_/ (/_ | | \/ (/_ | \/   |_) (_) |_ 
                                      /               
  `);
  console.log('Created by: Albert JT');
  console.log('\n');
  console.log(`Current Location: ${state.place}`)
  console.log('Current Parcels:');
  for (let parcel of state.parcels) {
    console.log(`From: ${parcel.address} - To: ${parcel.place}`)
  }
}

//Main function
function runRobot(state, robot, memory) {
  greeting(state, robot);
  console.log('\n')
  console.log("Start Delivery...")
  for (let turn = 0; ; turn++) {
    if (state.parcels.length == 0) {
      console.log(`Done in ${turn} turns`);
      break;
    }
    let action = robot(state, memory);
    state = state.move(action.direction);
    memory = action.memory;
    console.log(`Moved to ${action.direction}`);
  }
}

/** 
 * Traverse route randomly.
 * The robot will randomly pick which location to go to next.
 */
function randomPick(array) {
  let choice = Math.floor(Math.random() * array.length);
  return array[choice];
}

function randomPickAddress() {
  let array = Object.keys(roadGraph);
  return randomPick(array);
}

function randomRobot(state) {
  return { direction: randomPick(roadGraph[state.place]) };
}

//Generate random parcels static method
VillageState.random = function (parcelCount = 5) {
  let parcels = [];
  for (let i = 0; i < parcelCount; i++) {
    let address = randomPickAddress();
    let place;
    do {
      place = randomPickAddress();
    } while (place == address);
    parcels.push({ place, address });
  }
  return new VillageState("Post Office", parcels);
};

//runRobot(VillageState.random(), randomRobot)


/** 
 * Traverse route by designated route.
 * By this algorithm the robot will only traverse at maximum the length of mailRoute.
 */
const mailRoute = [
  "Alice's House",
  "Cabin",
  "Alice's House",
  "Bob's House",
  "Town Hall",
  "Daria's House",
  "Ernie's House",
  "Grete's House",
  "Shop",
  "Grete's House",
  "Farm",
  "Marketplace",
  "Post Office",
];

function routeRobot(state, memory) {
  if (memory.length == 0) {
    memory = mailRoute;
  }
  return { direction: memory[0], memory: memory.slice(1) };
}

//runRobot(VillageState.random(), routeRobot, []);

/** 
 * Traverse route with pathfinding algorithm.
 * The robot will try to find the next path by using BFS algorithm.
 */

//BFS search algorithm
//This algorithm assumes that all vertices are always connected
function findRoute(graph, from, to) {
  let work = [{ at: from, route: [] }];
  for (let i = 0; i < work.length; i++) {
    let { at, route } = work[i];
    for (let place of graph[at]) {
      if (place == to) return route.concat(place); //Return route to destination
      if (!work.some((w) => w.at == place)) //Check whether or not the current destination has been visited
        work.push({ at: place, route: route.concat(place) }); //Add to array to be checked
    }
  }
}

function goalOrientedRobot({place, parcels}, route) {
  if (route.length == 0) {
    let parcel = parcels[0];
    if (parcel.place != place) {
      route = findRoute(roadGraph, place, parcel.place);
    } else {
      route = findRoute(roadGraph, place, parcel.address);
    }
  }
  return {direction: route[0], memory: route.slice(1)};
}

runRobot(VillageState.random(), goalOrientedRobot, []);
