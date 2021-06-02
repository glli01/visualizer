export function getNewGridWithNoStartNode(grid, row, col) {
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
}

export function getNewGridWithNoFinishNode(grid, row, col) {
  //add walls
  const newGrid = grid.slice(); //shallow copy of grid
  const node = newGrid[row][col];
  const newNode = {
    // toggles isWall prop
    ...node,
    isFinish: false,
  };
  newGrid[row][col] = newNode; // updates node in newGrid
  return newGrid;
}

export function getNewGridWithNewStartNode(grid, row, col) {
  //add walls
  // TODO: make more efficient.
  const newGrid = grid.slice(); //shallow copy of grid
  const node = newGrid[row][col];
  const newNode = {
    // toggles isWall prop
    ...node,
    isStart: true,
  };
  newGrid[row][col] = newNode; // updates node in newGrid
  return newGrid;
}

export function getNewGridWithNewFinishNode(grid, row, col) {
  //add walls
  // TODO: make more efficient.
  const newGrid = grid.slice(); //shallow copy of grid
  const node = newGrid[row][col];
  const newNode = {
    // toggles isWall prop
    ...node,
    isFinish: true,
  };
  newGrid[row][col] = newNode; // updates node in newGrid
  return newGrid;
}
export function getNewGridWithTentativeStartNode(grid, row, col) {
  //add walls
  // TODO: make more efficient.
  document
    .querySelectorAll(".node-tentative-start")
    .forEach((e) => e.classList.remove("node-tentative-start"));
  document
    .getElementById(`node-${row}-${col}`)
    .classList.add("node-tentative-start");
}

export function getNewGridWithTentativeFinishNode(grid, row, col) {
  //add walls
  // TODO: make more efficient.
  document
    .querySelectorAll(".node-tentative-finish")
    .forEach((e) => e.classList.remove("node-tentative-finish"));
  document
    .getElementById(`node-${row}-${col}`)
    .classList.add("node-tentative-finish");
}
