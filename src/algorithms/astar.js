import { sortNodesByDistance } from "./dijkstra";

const astar = (grid, startNode, finishNode) => {
  let visitedNodesInOrder = [];
  let queue = [];
  queue.push(startNode);
  startNode.distance = 0; //dist = gscore
  startNode.fscore = manhattanDistance(startNode, endNode);
  while (queue.length > 0) {
    //minheap/pq based on fscore
    sortNodesByFscore(queue);
    const currentNode = queue.shift();
  }
};
