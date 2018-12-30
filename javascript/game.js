'use strict';

var initialPositions = [];
var moves = [];

var openList = new CustomHeap(),
  startTime,
  endTime,
  steps = 0,
  checked = 0,
  closedList = {}, 
  goalMap = {},
  size;
  
function resetAll()
{
    openList = new CustomHeap();
    steps = 0;
    checked = 0;
    closedList = {}; 
    goalMap = {};
    moves = [];
}

function hashState(state) 
{
    var stateLength = state.length;
    var hash = 0;
    
    for (var i = 0; i < stateLength; i++)
        hash += state[i] * Math.pow(stateLength, i);

    return hash;
}

function shuffle(array) 
{
    var size = array.length;
    var rand;
    for (var i = 1; i < size; i += 1)
    {
        rand = Math.round(Math.random() * i);
        swap(array, rand, i);
    }
    return array;
}

function move(state, pos, steps)
{
    var newState = [];
    newState.push.apply(newState, state);
    swap(newState, pos, pos + steps);
    return newState;
}

function swap(state, from, to) 
{
    var temp = state[from];
    state[from] = state[to];
    state[to] = temp;
}

function compare(arr1, arr2) 
{
  if (!arr1 || !arr2) 
  {
        return false;
  }

  for (var i = 0; i < arr1.length; i++) 
  {
        if (arr1[i] !== arr2[i]) 
        {
            return false;
        }
  }
  return true;
}

function getSuccessors(state) 
{
    var newState;
    var successors = [];
    var pos = state.indexOf(0);
    var row = Math.floor(pos / size);
    var col = pos % size;

    if (row > 0 && state.direction !== 'd') 
    {
        //move up
        newState = move(state, pos, -size);
        newState.direction = 'u';
        newState.prev = state;
        newState.pos = pos + steps;
        successors.push(newState);
    }
    if (col > 0 && state.direction !== 'r') 
    {
        //move left
        newState = move(state, pos, -1);
        newState.direction = 'l';
        newState.prev = state;
        newState.pos = pos - steps;
        successors.push(newState);
    }
    if (row < size - 1 && state.direction !== 'u') 
    {
        //move down
        newState = move(state, pos, size);
        newState.direction = 'd';
        newState.prev = state;
        newState.pos = pos + steps;
        successors.push(newState);
    }
    if (col < size - 1 && state.direction !== 'l') 
    {
        //move right
        newState = move(state, pos, 1);
        newState.direction = 'r';
        newState.prev = state;
        newState.pos = pos + steps;
        successors.push(newState);
    }
    
    return successors;
}

function calcHScore(state) 
{
    var totalDist = 0;
    
    for (var i = 0; i < state.length - 1; i++)
    {
        var q = state[i];
        if (q !== 0) 
        {
            var realPos = goalMap[q];
            var realCol = realPos % 3;
            var realRow = Math.floor(realPos / 3);
            var col = i % 3;
            var row = Math.floor(i / 3);
            totalDist += (Math.abs(realCol - col) + Math.abs(realRow - row));
        }
    }
    return totalDist;
}

function getSteps(state)
{
    var a = state.splice(0, state.length);
    steps++;
    if (!state.prev) 
    {
        return state;
    }
   
    moves.unshift(a[state.pos]);
    getSteps(state.prev);
}

function aStarSearch(state) 
{
    var _state;
    state.levels = 0;
    state.prev = null;
    openList.push(state);
    _state = hashState(state);
    closedList[_state] = true;

    while (!openList.empty()) 
    {
        var currentState = openList.pop();
        
        if (compare(initialPositions, currentState)) 
        {
            getSteps(currentState);
            break;
        }
        
        var successors = getSuccessors(currentState);
        
        for (var i = 0; i < successors.length; i++) 
        {
            checked++;
            var s = successors[i];
            _state = hashState(s);
            //  console.log(closedList[_state]);
            if (closedList[_state]) 
                continue;
            
                closedList[_state] = true;
            s.heuristicCost = calcHScore(s);
            s.levels = s.prev.levels + 1;
            s.totalCost = s.heuristicCost + s.levels;
            openList.push(s);
        }
    }
}




function CustomHeap() 
{
    var values = new Array(1000000);
    var size = 0;

    this.empty = function() 
    {
        return size === 0;
    };

    function parent(index) 
    {
        return Math.floor((index - 1) / 2);
    }

    this.push = function(element) 
    {
        values[size] = element;
        var node = size;
        
        while (node > 0) 
        {
            var parentWeight = values[parent(node)].totalCost;
            var currentWeight = values[node].totalCost;
            
            if (currentWeight >= parentWeight) 
                break;
            
            swap(parent(node), node);
            node = parent(node);
        }
        size++;
    };

    this.pop = function() 
    {
        var _size = size - 1;
        swap(_size, 0);
        
        var currentState = values[_size];
        values[_size] = undefined;
        size--;
        shiftDown(0);
        
        return currentState;
    };


    function left(index) 
    {
        return index * 2 + 1;
    }

    function right(index) 
    {
        return (index * 2) + 2;
    }

    function swap(from, to) 
    {
        var temp = values[from];
        values[from] = values[to];
        values[to] = temp;
    }

    function shiftDown(i) 
    {
        var leftChild = left(i);
        var len = size;


        if (leftChild >= len) 
            return;
        
        var smallest = values[leftChild];
        var smallestIndex = leftChild;
        var rightChild = right(i);
        
        if (rightChild < len)
        {
            var r = values[rightChild];
            
            if (smallest.totalCost > r.totalCost) 
            {
                smallest = r;
                smallestIndex = rightChild;
            }
        }
        
        if (smallest.totalCost < values[i].totalCost) 
        {
            swap(i, smallestIndex);
            shiftDown(smallestIndex);
        }
    }
}
  

var solvePuzzle = function(currentState)
{
    resetAll();
    initialPositions = currentState;
    var goal =  [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (var i = 0; i < initialPositions.length; i++) 
        goalMap[initialPositions[i]] = i;

    size = Math.sqrt(initialPositions.length);
    aStarSearch(goal);
    return moves;
};
