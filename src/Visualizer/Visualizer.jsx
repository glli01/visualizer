import { useEffect } from "react";
import React, { useState } from "react";
import Node from "./Node/Node";
import "./Visualizer.css";
import { dijkstra, getNodesInShortestPathOrder } from "../algorithms/dijkstra";
import { bfs } from "../algorithms/bfs";
//arbitrary contents to decide grid size.
//TODO: Responsive
// refactor so that this is calculated by screen size.
let START_NODE_ROW = 10;
let START_NODE_COL = 15;
let FINISH_NODE_ROW = 10;
let FINISH_NODE_COL = 35;
const MARGIN = 100;
let grid_cols;
let grid_rows;
const Visualizer = () => {
  //defining the visualizer as a functional component instead of
  // a class
  const [state, setState] = useState({ grid: [], mouseIsPressed: false }); // define necessary
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
    START_NODE_COL = Math.floor(grid_cols / 6);
    START_NODE_ROW = Math.ceil(grid_rows / 2);
    FINISH_NODE_COL = Math.floor((grid_cols / 6) * 5);
    FINISH_NODE_ROW = Math.ceil(grid_rows / 2);
    const grid = getInitialGrid(); //calls getInitialGrid which calculates and formulates
    //grid shape of the app.
    setState({ grid }); // sets state property grid to be grid.
  }, []);

  const handleMouseDown = (row, col) => {
    //mouse down handler
    const newGrid = getNewGridWithWall(state.grid, row, col); // calls funct to set walls
    setState({ grid: newGrid, mouseIsPressed: true }); // sets and rerenders app
  };

  const handleMouseEnter = (row, col) => {
    //mouse enter handler (when cursor goes into square)
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

  //function for animating dijkstra (blue)
  const animateDijkstra = (visitedNodesInOrder, nodesInShortestPathOrder) => {
    for (let i = 0; i <= visitedNodesInOrder.length; i++) {
      // for all visited nodes
      if (i === visitedNodesInOrder.length) {
        // if last node... call special funct
        setTimeout(() => {
          animateShortestPath(nodesInShortestPathOrder); //this will set classes
          //to facilitate animation (yellow)
        }, 5 * i); // calls animate shortest path every w/ step delay
      } else {
        setTimeout(() => {
          //hacky way to display changes
          //TODO: Follow React Standards
          //replace getElement w/ refs.
          const node = visitedNodesInOrder[i];
          document.getElementById(`node-${node.row}-${node.col}`).className =
            "node node-visited"; //sets node-visited for css animation (blue)
        }, 5 * i);
      }
    }
  };

  //for animating final path (yellow)
  const animateShortestPath = (nodesInShortestPathOrder) => {
    for (let i = 0; i < nodesInShortestPathOrder.length; i++) {
      setTimeout(() => {
        const node = nodesInShortestPathOrder[i];
        document.getElementById(`node-${node.row}-${node.col}`).className =
          "node node-shortest-path"; //same as above.
      }, 50 * i);
    }
  };

  const resetVisited = (grid) => {
    for (let row = 0; row < grid_rows; row++) {
      for (let col = 0; col < grid_cols; col++) {
        const node = grid[row][col];
        node.isVisited = false;
        node.previousNode = null;
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
  };

  const visualize = (funct) => {
    const { grid } = state; //same as stating const grid = state.grid;
    resetVisited(grid);
    setState({ ...state, grid });
    const startNode = grid[START_NODE_ROW][START_NODE_COL];
    const finishNode = grid[FINISH_NODE_ROW][FINISH_NODE_COL];
    const visitedNodesInOrder = funct(grid, startNode, finishNode); //sets nodes in order
    //to array returned from dijkstra algorithm under algorithm/ dijkstra.js
    //dijkstra's = take nieghbors unvisited, set new dist. until all nodes visited/end
    // at end, will have shortest dist bc first time a node is visited is guaranteed
    // to be the lowest dist.  (greedy)
    const nodesInShortestPathOrder = getNodesInShortestPathOrder(finishNode); // sets nodes
    // in shortestpath order to the prev chaining from method getNodesInShortestPath.
    animateDijkstra(visitedNodesInOrder, nodesInShortestPathOrder); // calls animation
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
      isStart: row === START_NODE_ROW && col === START_NODE_COL,
      isFinish: row === FINISH_NODE_ROW && col === FINISH_NODE_COL,
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
  };

  return (
    <>
      <div className="nav-bar flex-box between" id="nav-bar">
        <div className="logo">PATH VISUALIZER</div>
        <div className="directory flex-box">
          <div className="nav-item">algorithm</div>
          <div className="nav-item">algorithm</div>
          <div className="nav-item">algorithm</div>
          <div className="nav-item">algorithm</div>
          <div className="nav-item">algorithm</div>
          <button onClick={() => clearGrid()}>Clear</button>
          <button onClick={() => visualize(bfs)}>VISUALIZE</button>
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
                    onMouseEnter={(row, col) => handleMouseEnter(row, col)}
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
