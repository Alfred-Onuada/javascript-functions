function seed() {
  let arr = [];

  for (let i = 0; i < arguments.length; i++) {
    arr.push(arguments[i]);
  }

  return arr;
}

function same([x, y], [j, k]) {
  // returns a boolean true or false if the cells contain identical values
  return x === j && y === k;
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.some(item => same(item, cell));
}

const printCell = (cell, state) => {
  let isAlive = contains.call(state, cell);

  if (isAlive) {
    return '\u25A3';
  } else {
    return '\u25A2';
  }
};

const corners = (state = []) => {
  let cornersObject = {
    topRight: [0, 0],
    bottomLeft: [0, 0]
  }

  if (state.length === 0) {
    return cornersObject;
  }

  distFromLeft = []
  distFromBottom = []

  state.forEach(item => {
    distFromLeft.push(item[0]);
    distFromBottom.push(item[1]);
  })

  cornersObject.topRight = [Math.max(...distFromLeft), Math.max(...distFromBottom)];
  cornersObject.bottomLeft = [Math.min(...distFromLeft), Math.min(...distFromBottom)];

  return cornersObject;
};

const printCells = (state) => {
  const { topRight, bottomLeft } = corners(state);

  let output = "";

  for (let row = topRight[1]; row >= bottomLeft[1]; row--) {
    for (let col = bottomLeft[0]; col <= topRight[0]; col++) {
      output += printCell([col, row], state);
      output += " ";
    }

    output += "\n";
  }

  return output;

};

const getNeighborsOf = ([x, y]) => {
  let neighbors = []

  for (let row = x-1; row <= x+1; row++) {
    for (let col = y+1; col >= y-1; col--) {
      if (!same([x, y], [row, col])) {
        neighbors.push([row, col])
      }
    }
  }

  return neighbors;
};

const getLivingNeighbors = (cell, state) => {
  let neighbors = getNeighborsOf(cell);

  let livingNeigbours = [];

  let decoratedContains = contains.bind(state);

  neighbors.forEach(neighbor => {
    if (decoratedContains(neighbor)) {
      livingNeigbours.push(neighbor);
    }
  })

  return livingNeigbours;
};

const willBeAlive = (cell, state) => {
  let livingNeigboursCount = getLivingNeighbors(cell, state).length;

  let cellIsAlive = contains.call(state, cell);

  return (livingNeigboursCount === 3 || (cellIsAlive && livingNeigboursCount === 2));

};

const calculateNext = (state) => {
  let { bottomLeft, topRight } = corners(state);

  bottomLeft[0] -= 1;
  bottomLeft[1] -= 1;

  topRight[0] += 1;
  topRight[1] += 1;

  let nextState = [];

  for (let row = topRight[1]; row >= bottomLeft[1]; row--) {
    for (let col = bottomLeft[0]; col <= topRight[0]; col++) {
      if (willBeAlive([row, col], state)) {
        nextState.push([row, col]);
      }
    }
  }

  return nextState;

};

const iterate = (state, iterations) => {
  let futureGameStates = [state];

  let recentState = state;
  for (let i = 0; i < iterations; i++) {
    recentState = calculateNext(recentState);
    futureGameStates.push(recentState);
  }

  return futureGameStates;
};

const main = (pattern, iterations) => {
  let startingState = startPatterns[pattern];

  let newGameStates = iterate(startingState, iterations);

  for (let i = 0; i < newGameStates.length; i++) {
    console.log(printCells(newGameStates[i]))
    console.log("\n");
  }

};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;