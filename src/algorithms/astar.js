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
    if (closestNode.fscore === Infinity) return visitedNodesInOrder;
    if (currentNode === endNode) return visitedNodesInOrder;
  }
}

const manhattanDistance = (node1, node2) => {
  return Math.abs(node2.col - node1.col) + Math.abs(node2.row - node1.row);
};

const sortNodesByFscore = (queue) => {
  queue.sort((nodeA, nodeB) => nodeA.fscore - nodeB.fscore);
};
