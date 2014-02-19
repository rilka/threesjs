/******************** HOUSEKEEPING *******************************************/

// Constants
LEFT = 37;
RIGHT = 39;
UP = 38;
DOWN = 40;

// Globals
var tiles = [];
var next_tile = null;

/******************** UTILITY FUNCTIONS **************************************/

function random_tile_with_blank() {
  var ps = [0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3];
  var ind = Math.floor(Math.random() * ps.length);
  return ps[ind];
}

// TODO: Should use shuffled-deck algorithm instead
function random_tile() {
  var ps = [1, 1, 1, 1, 1, 1,
            2, 2, 2, 2, 2, 2,
            3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
            6, 6, 6, 6,
            12, 12,
            24];
  var ind = Math.floor(Math.random() * ps.length);
  return ps[ind];
}

// Helper to compute tile class
function tile_class(tile) {
  if (tile == 1) {
    return "red";
  }
  else if (tile == 2) {
    return "blue";
  }
  else {
    return "number";
  }
}

// Helper to repeat |block| |n| times
Template.game.times = function(n, block) {
  var result = "";
  for (var i = 0; i < n; i++) {
    result += block.fn(i);
  }
  return result;
}

/******************** DISPLAY FUNCTIONS **************************************/

function render_board() {
  for (var i = 0; i <= 3; i++) {
    for (var j = 0; j <= 3; j++) {
      var t = tiles[i][j];

      if (tiles[i][j] != 0) {
        var block = Template.tile({row: i, col: j, tile: t});
        block = $(block).addClass(tile_class(t));

        // (Here there be magic numbers)
        block = $(block).css({
          left: 22 + (j * 92),
          top: 22 + (i * 130)
        });

        $(".board").append(block);
      }
    }
  }
}

function render_next() {
  $(".next .tile").addClass(tile_class(next_tile));
}

function animate_move(obj, direction) {
  var board = obj.board;
  var moved = obj.moved;

  var movement;

  switch(direction) {
    case LEFT:
      movement = function(c) {
        return {top: c.top, left: c.left - 92};
      }
      coords = function(i, j) {
        return String(i) + String(j - 1);
      }
    break;

    case RIGHT:
      movement = function(c) {
        return {top: c.top, left: c.left + 92};
      }
      coords = function(i, j) {
        return String(i) + String(j + 1);
      }
    break;

    case UP:
      movement = function(c) {
        return {top: c.top - 130, left: c.left};
      }
      coords = function(i, j) {
        return String(i - 1) + String(j);
      }
    break;

    case DOWN:
      movement = function(c) {
        return {top: c.top + 130, left: c.left};
      }
      coords = function(i, j) {
        return String(i + 1) + String(j);
      }
    break;
  }

  _.each(moved, function(t) {
    var el = $("[data-coords=" + String(t.i) + String(t.j) + "]");

    var old_coords = {top: parseInt(el.css("top")), left: parseInt(el.css("left"))};
    var new_coords = movement(old_coords);

    // TODO: Figure out z-index shenanigans
    el.css("zIndex", el.css("zIndex") + 10);
    el.animate({
      top: new_coords.top,
      left: new_coords.left
    }, 200, "easeOutQuart", function() {

      // TODO: Refactor
      $("[data-coords=" + coords(t.i, t.j) + "]").remove();
      el.attr("data-coords", coords(t.i, t.j));
      el.removeClass("blue");
      el.removeClass("red");
      el.removeClass("number");
      el.addClass(tile_class(t.t));
      el.html(t.t);
    });


  });

}

/******************** GAME FUNCTIONS *****************************************/

function new_game() {
  // Generate new configuration
  tiles = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
  for (var i = 0; i <= 3; i++) {
    for (var j = 0; j <= 3; j++) {
      tiles[i][j] = random_tile_with_blank();
    }
  }

  // Generate new next tile
  next_tile = random_tile();

  // Render new configuration and next tile
  render_board();
  render_next();
}

function move(e) {
  e.preventDefault();

  var direction = e.which;
  var g = generate_new_board(direction);

  // Check if any tiles moved
  if (_.isEmpty(g.moved)) {
    return;
  }

  // Execute the move
  animate_move(g, direction);
  tiles = g.board;

  // Extract the columns that moved
  // Add in the new tile
  // Update global tiles array

  tick();
}

function generate_new_board(direction) {
  var board = JSON.parse(JSON.stringify(tiles));
  var moved = [];

  var attempt_tile_move = function(i, j, i_pr, j_pr) {
    // Empty space
    if (board[i][j] == 0) {
      return;
    }

    // Twins
    if (board[i][j] == board[i_pr][j_pr]) {
      // Not actually twins
      if (board[i][j] == 1 || board[i][j] == 2) {
        return;
      }

      // Okay actually twins
      board[i][j] = 0;
      board[i_pr][j_pr] *= 2;
      moved.push({i: i, j: j, t: board[i_pr][j_pr]});
    }

    // Not twins
    else {
      // Move to empty space
      if (board[i_pr][j_pr] == 0) {
        board[i_pr][j_pr] = board[i][j];
        board[i][j] = 0;
        moved.push({i: i, j: j, t: board[i_pr][j_pr]});
      }

      // 1 + 2 = 3
      else if ((board[i][j] == 1 && board[i_pr][j_pr] == 2) ||
               (board[i][j] == 2 && board[i_pr][j_pr] == 1)) {
        board[i_pr][j_pr] = 3;
        board[i][j] = 0;
        moved.push({i: i, j: j, t: board[i_pr][j_pr]});
      }
    }
  }

  switch(direction) {
    case LEFT:
      for (var i = 0; i <= 3; i++) {
        for (var j = 0; j <= 3; j++) {
          if (j == 0) {
            continue;
          }
          attempt_tile_move(i, j, i, j - 1);
        }
      }
    break;

    case RIGHT:
      for (var i = 0; i <= 3; i++) {
        for (var j = 3; j >= 0; j--) {
          if (j == 3) {
            continue;
          }
          attempt_tile_move(i, j, i, j + 1);
        }
      }
    break;

    case UP:
      for (var j = 0; j <= 3; j++) {
        for (var i = 0; i <= 3; i++) {
          if (i == 0) {
            continue;
          }
          attempt_tile_move(i, j, i - 1, j);
        }
      }
    break;

    case DOWN:
      for (var j = 0; j <= 3; j++) {
        for (var i = 3; i >= 0; i--) {
          if (i == 3) {
            continue;
          }
          attempt_tile_move(i, j, i + 1, j);
        }
      }
    break;
  }

  return {board: board, moved: moved};
}

function tick() {
  // Check for empty spaces
  var tile_list = _.flatten(tiles);
  if (_.contains(tile_list, 0)) {
    next();
    return;
  }

  // Check for moves in every direction
  var directions = [LEFT, RIGHT, UP, DOWN];
  for (var d = 0; d <= 3; d++) {
    var g = generate_new_board(directions[d]);
    if (!_.isEmpty(g.moved)) {
      next();
      return;
    }
  }

  // Oops, no empty spaces or moves left
  lost();
}

function next() {
  next_tile = random_tile();
}

// TODO: Make endgame cute
// TODO: Share scores
function lost() {
  var score_tile = function(t) {
    score = Math.pow(3, (Math.log(t / 3) / Math.log(2) + 1));
    return Math.floor(score);
  }

  var total = _.reduce(_.flatten(tiles), function(acc, t) {
    return acc + score_tile(t);
  }, 0);

  alert("No more moves! Your score is " + total + " ^__^");

  new_game();
}

/******************** GAME LOOP **********************************************/

$(function() {
  new_game();
  $(window).on("keydown", move);
});