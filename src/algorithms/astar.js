export function astar(grid, startNode, endNode) {
  let visitedNodesInOrder = [];
  let queue = [];
  queue.push(startNode);
  startNode.distance = 0; //dist = gscore
  console.log(
    "The manhattan Distance is: " + manhattanDistance(startNode, endNode)
  );
  startNode.fscore = manhattanDistance(startNode, endNode);
  while (queue.length > 0) {
    //minheap/pq based on fscore
    sortNodesByFscore(queue);
    const currentNode = queue.shift();
    if (currentNode.isWall) continue;
    if (currentNode.fscore === Infinity) return visitedNodesInOrder;
    let neighbors = getNeighbors(currentNode, grid);
    for (let i = 0; i < neighbors.length; i++) {
      //for each neighbor.
      let neighbor = neighbors[i];
      let tentativeDist = currentNode.distance + 1; //dist = gscore
      if (tentativeDist < neighbor.distance) {
        neighbor.previousNode = currentNode;
        neighbor.distance = tentativeDist;
        neighbor.fscore =
          neighbor.distance + manhattanDistance(neighbor, endNode);
        if (!queue.find((element) => element === neighbor)) {
          queue.push(neighbor);
        }
      }
    }
    visitedNodesInOrder.push(currentNode);
    if (currentNode === endNode) return visitedNodesInOrder;
  }
}

const manhattanDistance = (node1, node2) => {
  return Math.abs(node1.col - node2.col) + Math.abs(node1.row - node2.row);
};

const sortNodesByFscore = (queue) => {
  queue.sort((nodeA, nodeB) => nodeA.fscore - nodeB.fscore);
};

const getNeighbors = (node, grid) => {
  console.log("In getUnvisited Neighbors");
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
};
