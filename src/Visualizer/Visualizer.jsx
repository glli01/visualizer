import { useEffect } from "react";
import React, { useState } from "react";
import Node from "./Node/Node";
import "./Visualizer.css";
import { astar } from "../algorithms/astar";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { bfs } from "../algorithms/bfs";
//arbitrary contents to decide grid size.
//TODO: Responsive
// refactor so that this is calculated by screen size.
let nSTART_NODE_ROW = 10;
let nSTART_NODE_COL = 15;
let nFINISH_NODE_ROW = 10;
let nFINISH_NODE_COL = 35;
const MARGIN = 100;
let grid_cols;
let grid_rows;
let shortestPathLambda = [];
let animateLambda = [];
let start = false;
let finish = false;
const Visualizer = () => {
  //defining the visualizer as a functional component instead of
  // a class
  const [state, setState] = useState({
    grid: [],
    mouseIsPressed: false,
  });
  const [startOrEnd, setStartOrEnd] = useState({
    START_NODE_COL: 15,
    START_NODE_ROW: 10,
    FINISH_NODE_COL: 35,
    FINISH_NODE_ROW: 10,
  });
  const [visualizeFunct, setVisualizeFunct] = useState(() => dijkstra); // define necessary
  // parts of state.
  // componentDidMount
  useEffect(() => {
    // Calculate columns and rows
    grid_cols = Math.floor((window.innerWidth - MARGIN) / 25);
    grid_rows = Math.floor(
      (window.innerHeight -
        document.querySelector(".nav-bar").offsetHeight -
        MARGIN) /
        25
    );
    // calculate start_node_row / col
    nSTART_NODE_COL = Math.floor(grid_cols / 6);
    nSTART_NODE_ROW = Math.ceil(grid_rows / 2);
    nFINISH_NODE_COL = Math.floor((grid_cols / 6) * 5);
    nFINISH_NODE_ROW = Math.ceil(grid_rows / 2);
    setStartOrEnd({
      START_NODE_COL: nSTART_NODE_COL,
      START_NODE_ROW: nSTART_NODE_ROW,
      FINISH_NODE_COL: nFINISH_NODE_COL,
      FINISH_NODE_ROW: nFINISH_NODE_ROW,
    });
    console.log("nSTart" + nSTART_NODE_ROW + " " + nSTART_NODE_COL);
    // sets state property grid to be grid.
    const grid = getInitialGrid();
    setState({ grid });
  }, []);

  const handleMouseDown = (row, col) => {
    //mouse down handler
    const { START_NODE_ROW, START_NODE_COL, FINISH_NODE_COL, FINISH_NODE_ROW } =
      startOrEnd;
    if (row === START_NODE_ROW && col === START_NODE_COL) {
      //call startNode method
      const newGrid = getNewGridWithNoStartNode(state.grid, row, col);
      start = true;
      return;
    }

    if (row === FINISH_NODE_ROW && col == FINISH_NODE_COL) {
      //call finishNodemove method.
    }
    const newGrid = getNewGridWithWall(state.grid, row, col); // calls funct to set walls
    setState({ grid: newGrid, mouseIsPressed: true }); // sets and rerenders app
  };

  const handleMouseEnter = (row, col, start, finish) => {
    //mouse enter handler (when cursor goes into square)
    const { START_NODE_ROW, START_NODE_COL, FINISH_NODE_COL, FINISH_NODE_ROW } =
      startOrEnd;
    if (start) {
      //call startNode method
      getNewGridWithNewStartNode(state.grid, row, col);

      return;
    }
    if (!state.mouseIsPressed) return; // do nothing if mouse isn't held down
    const newGrid = getNewGridWithWall(state.grid, row, col);
    let newState = state;
    newState = { ...newState, grid: newGrid };
    setState(newState);
  };

  const handleMouseUp = () => {
    //mouse up handler
    let newState = state;
    newState = { ...newState, mouseIsPressed: false };
    setState(newState); // sets mouse press = false, stop drawing walls.
  };

  const getNewGridWithNoStartNode = (grid, row, col) => {
    //add walls
    const newGrid = grid.slice(); //shallow copy of grid
    const node = newGrid[row][col];
    const newNode = {
      // toggles isWall prop
      ...node,
      isStart: false,
    };
    newGrid[row][col] = newNode; // updates node in newGrid
    return newGrid;
  };

  const getNewGridWithNewStartNode = (grid, row, col) => {
    //add walls
    document
      .querySelectorAll(".node-tentative-start")
      .forEach((e) => e.classList.remove("node-tentative-start"));
    document
      .getElementById(`node-${row}-${col}`)
      .classList.add("node-tentative-start");
  };

  //function for animating dijkstra (blue)
  const animate = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    if (!visitedNodesInOrder) {
      console.log("visitedNodesInOrder is undefined");
      return;
    }
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      // for all visited nodes
      if (i === visitedNodesInOrder.length) {
        // if last node... call special funct
        let animation = setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder); //this will set classes
          //to facilitate animation (yellow)
        }, 5 * i); // calls animate shortest path every w/ step delay
        animateLambda.push(animation);
      } else {
        let animation = setTimeout(() => {
          //hacky way to display changes
          //TODO: Follow React Standards
          //replace getElement w/ refs.
          const node = visitedNodesInOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited"; //sets node-visited for css animation (blue)
        }, 5 * i);
        animateLambda.push(animation);
      }
    }
  };

  //for animating final path (yellow)
  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      let animation = setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path"; //same as above.
      }, 50 * i);
      shortestPathLambda.push(animation);
    }
  };

  const resetVisited = (grid) => {
    for (let row = 0; row < grid_rows; row++) {
      for (let col = 0; col < grid_cols; col++) {
        const node = grid[row][col];
        node.isVisited = false;
        node.previousNode = null;
        node.distance = Infinity;
        node.fscore = Infinity;
        document.getElementById(`node-${row}-${col}`).className = "node";
        if (node.isWall)
          document
            .getElementById(`node-${row}-${col}`)
            .classList.add("node-wall");
        if (node.isStart)
          document
            .getElementById(`node-${row}-${col}`)
            .classList.add("node-start");
        if (node.isFinish)
          document
            .getElementById(`node-${row}-${col}`)
            .classList.add("node-finish");
      }
    }
    if (animateLambda) clearTimeout(animateLambda);
    if (shortestPathLambda) clearTimeout(shortestPathLambda);
  };

  const visualize = (funct) => {
    const { grid } = state; //same as stating const grid = state.grid;
    resetVisited(grid);
    setState({ ...state, grid });
    const { START_NODE_ROW, START_NODE_COL, FINISH_NODE_COL, FINISH_NODE_ROW } =
      startOrEnd;
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = funct(grid, startNode, finishNode); //sets nodes in order
    //to array returned from dijkstra algorithm under algorithm/ dijkstra.js
    //dijkstra's = take nieghbors unvisited, set new dist. until all nodes visited/end
    // at end, will have shortest dist bc first time a node is visited is guaranteed
    // to be the lowest dist.  (greedy)
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode); // sets nodes
    // in shortestpath order to the prev chaining from method getNodesInShortestPath.
    animate(visitedNodesInOrder, nodesInShortestPathOrder); // calls animation
  };

  //GRID functions
  const getInitialGrid = () => {
    const grid = []; // initial empty array.
    for (let row = 0; row < grid_rows; row++) {
      // 20 x 50 grid
      const currentRow = [];
      for (let col = 0; col < grid_cols; col++) {
        currentRow.push(createNode(col, row)); // pushes nodes into each row
      }
      grid.push(currentRow);
    }
    return grid; // array of arrays
  };

  const createNode = (col, row) => {
    // creates struct (obj) of properties. for each node
    return {
      col,
      row,
      isStart: row === nSTART_NODE_ROW && col === nSTART_NODE_COL,
      isFinish: row === nFINISH_NODE_ROW && col === nFINISH_NODE_COL,
      distance: Infinity,
      fscore: Infinity,
      isVisited: false,
      isWall: false,
      previousNode: null,
    };
  };

  const getNewGridWithWall = (grid, row, col) => {
    //add walls
    const newGrid = grid.slice(); //shallow copy of grid
    const node = newGrid[row][col];
    const newNode = {
      // toggles isWall prop
      ...node,
      isWall: !node.isWall,
    };
    if (!node.isStart && !node.isFinish) newGrid[row][col] = newNode; // updates node in newGrid
    return newGrid;
  };

  const clearGrid = () => {
    const { grid } = state;
    for (let row = 0; row < grid_rows; row++) {
      for (let col = 0; col < grid_cols; col++) {
        const node = grid[row][col];
        node.isVisited = false;
        node.previousNode = null;
        node.isWall = false;
        document.getElementById(`node-${row}-${col}`).className = "node";
        if (node.isStart)
          document
            .getElementById(`node-${row}-${col}`)
            .classList.add("node-start");
        if (node.isFinish)
          document
            .getElementById(`node-${row}-${col}`)
            .classList.add("node-finish");
      }
    }
    if (animateLambda.length > 0) {
      animateLambda.forEach((animation) => clearTimeout(animation));
    }
    if (shortestPathLambda.length > 0) {
      shortestPathLambda.forEach((animation) => clearTimeout(animation));
    }
  };

  return (
    <>
      <div className="nav-bar flex-box between" id="nav-bar">
        <div className="logo">PATH VISUALIZER</div>
        <div className="directory flex-box">
          <ul className="nav-item drop">
            drop down
            <div id="drop-down">
              <li onClick={() => setVisualizeFunct(() => astar)}>astar</li>
              <li onClick={() => setVisualizeFunct(() => bfs)}>BFS </li>
              <li onClick={() => setVisualizeFunct(() => dijkstra)}>
                Dijkstra
              </li>
            </div>
          </ul>
          <div className="nav-item">algorithm</div>
          <div className="nav-item">algorithm</div>
          <div className="nav-item">algorithm</div>
          <div className="nav-item">algorithm</div>
          <div className="nav-item">algorithm</div>
          <button onClick={() => clearGrid()}>Clear</button>
          <button onClick={() => visualize(visualizeFunct)}>VISUALIZE</button>
        </div>
      </div>

      {/* GRID */}
      <div className="grid">
        {state.grid.map((row, rowIDx) => {
          // element, index mapping fct.
          //this grid map essentially maps each row inside grid (each element holds a row)
          //to return a div holding that row.
          return (
            <div key={rowIDx} class="row">
              {row.map((node, nodeIdx) => {
                //
                //this row map maps each node inside row (each element in grid)
                //to a node component which keeps track of the properties,
                // row, column, isFinish, isStart, and isWall, which are pretty self explanatory.
                //and uses 3 eventhandlers.
                const { row, col, isFinish, isStart, isWall } = node;
                return (
                  <Node
                    key={nodeIdx}
                    col={col}
                    isFinish={isFinish}
                    isStart={isStart}
                    isWall={isWall}
                    mouseisPressed={state.mouseIsPressed}
                    onMouseDown={(row, col) => handleMouseDown(row, col)}
                    onMouseEnter={(row, col) =>
                      handleMouseEnter(row, col, start, finish)
                    }
                    onMouseUp={() => handleMouseUp()}
                    row={row}
                  ></Node>
                );
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};
export default Visualizer;
