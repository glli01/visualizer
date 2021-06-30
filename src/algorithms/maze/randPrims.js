export function randPrims( grid ){
  grid.forEach(row => {
    row.forEach(Node => {
      Node.isWall = true;
      Node.isVisited = false;
    })
  })

  const queue = [];
  const maze = [];
  let rowNum = 0;
  grid.forEach(row => {
    let column = 0;

    row.forEach(Node => {
      if ((column % 2 === 1) && (rowNum % 2 === 1)) {
        Node.isWall = false;
        queue.push(Node);
      }
      column++;
    })
    rowNum++;
  })
  if (true) {
    let randInt = Math.floor(Math.random() * (queue.length));
    let Node = queue[randInt];
    Node.isVisited = true;

    console.log("Start Node col: " + Node.col + "Row: " + Node.row);
    let unvisitedNeighbors = getUnvisitedNeighborCells(Node, grid);
    console.log("unvisited neighbors are");
    console.log(unvisitedNeighbors);
    unvisitedNeighbors.forEach( neighbor => maze.push(neighbor));
  }

  while(maze.length){
    let randInt = Math.floor(Math.random() * (maze.length));
    let Node = maze[randInt];
    maze.splice(randInt, 1);
    Node.isVisited = true;
    let unvisitedNeighbors = getUnvisitedNeighborCells(Node, grid);
    console.log("unvisited neighbors are");
    console.log(unvisitedNeighbors);
    let visitedNeighbors = [];
    visitedNeighbors = getVisitedNeighborCells(Node, grid);
    unvisitedNeighbors.forEach( neighbor => {
      if (!maze.find(node => node === neighbor)) maze.push(neighbor)}
      );
    let random = Math.floor(Math.random() * (visitedNeighbors.length));
    console.log("Random is " + random);
    console.log("visited Neighbors is " + visitedNeighbors);
    console.log(maze);
    if (visitedNeighbors.length > 0){
      let chosenNode = visitedNeighbors[random];
      chosenNode.isVisited = true;
      let wall = getCellBetween(chosenNode, Node, grid);
      wall.isWall = false;
    }
  }
  return grid;
}

const getNeighborWalls = (node, grid) => {
  const neighbors = [];
  const { col, row } = node;
  if (row > 1) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 2) neighbors.push(grid[row + 1][col]);
  if (col > 1) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 2) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => neighbor.isWall);
};

const getVisitedNeighborCells = (node, grid) => {
  const neighbors = [];
  const { col, row } = node;
  if (row - 2 > 0) neighbors.push(grid[row - 2][col]);
  if (row + 2 < grid.length - 1) neighbors.push(grid[row + 2][col]);
  if (col - 2 > 0) neighbors.push(grid[row][col - 2]);
  if (col + 2 < grid[0].length - 1) neighbors.push(grid[row][col + 2]);
  return neighbors.filter(neighbor => neighbor.isVisited && !neighbor.isWall);
}

const getUnvisitedNeighborCells = (node, grid) => {
  const neighbors = [];
  const { col , row} = node;
  if (row - 2 > 0) neighbors.push(grid[row - 2][col]);
  if (row + 2 < grid.length - 1) neighbors.push(grid[row + 2][col]);
  if (col - 2 > 0) neighbors.push(grid[row][col - 2]);
  if (col + 2 < grid[0].length - 1) neighbors.push(grid[row][col + 2]);
  return neighbors.filter(neighbor => !neighbor.isVisited);
}

const getCellBetween = (node1, node2, grid) => {
  if (node1.col === node2.col){
    if (node1.row === node2.row - 2){
      return grid[node1.row + 1][node1.col];
    } else {
      return grid[node1.row - 1][node1.col];
    }
  } else {
    if (node1.col === node2.col - 2 ){
      return grid[node1.row][node1.col + 1];
    } else {
      return grid[node1.row][node1.col - 1];
    }
  }
  return grid[node1.row][node1.col];
}