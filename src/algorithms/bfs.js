import { getAllNodes, sortNodesByDistance } from "./dijkstra";
export function bfs(grid, startNode, finishNode) {
  let visitedNodesInOrder = [];
  let queue = [];
  queue.push(startNode);
  let i = 1;
  while (queue.length > 0) {
    console.log("in while loop" + i++);
    let currentNode = queue.shift();
    if (currentNode.isWall) continue;
    currentNode.isVisited = true;
    updateUnvisitedNodes(currentNode, grid, queue);
    visitedNodesInOrder.push(currentNode);
    if (currentNode === finishNode) return visitedNodesInOrder;
  }
  return visitedNodesInOrder;
}

// export function bfs(grid, startNode, finishNode) {
//   const visitedNodesInOrder = [];
//   startNode.distance = 0;
//   const unvisitedNodes = getAllNodes(grid);
//   while (!!unvisitedNodes.length) {
//     sortNodesByDistance(unvisitedNodes);
//     const closestNode = unvisitedNodes.shift();
//     // if wall, skip
//     if (closestNode.isWall) continue;
//     // If closest node is at dist inf,
//     // must be trapped and should stop
//     if (closestNode.distance === Infinity) return visitedNodesInOrder;
//     closestNode.isVisited = true;
//     visitedNodesInOrder.push(closestNode);
//     if (closestNode === finishNode) return visitedNodesInOrder;
//     updateUnvisitedNeighbors(closestNode, grid);
//   }
// }
const updateUnvisitedNodes = (node, grid, queue) => {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.isVisited = true;
    neighbor.previousNode = node;
    queue.push(neighbor);
  }
};

export function updateUnvisitedNeighbors(node, grid) {
  const unvisitedNeighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of unvisitedNeighbors) {
    neighbor.distance = node.distance + 1;
    neighbor.previousNode = node;
  }
}

export function getUnvisitedNeighbors(node, grid) {
  console.log("In getUnvisited Neighbors");
  const neighbors = [];
  const { col, row } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited);
}
