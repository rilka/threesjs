LEFT = 37;
RIGHT = 39;
UP = 38;
DOWN = 40;

if (Meteor.isClient) {

  Template.game.rows = function() {
    return Session.get("tiles");
  }

  Template.game.next = function() {
    return Session.get("next_tile");
  }

  Template.game.tile_class = function(tile) {
    switch(tile) {
      case 0:
        return "none";
      case 1:
        return "blue";
      case 2:
        return "red";
      default:
        return "number";
    }
  }

  Template.game.tile_text = function(tile) {
    if (!tile)
      return " ";
    else
      return tile;
  }

  Template.game.tile_next = function(tile) {
    if (tile >= 3) {
      return " ";
    }
  }

  // TODO (P1): Calibrate new game
  function new_game() {
    var tiles = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

    function random_tile_blank() {
      var probs = [0, 0, 0, 0, 0, 0, 3, 3, 2, 2, 1, 1];
      var ind = Math.floor(Math.random() * probs.length);
      return probs[ind];
    }

    for (var i = 0; i <= 3; i++) {
      for (var j = 0; j <= 3; j++) {
        tiles[i][j] = random_tile_blank();
      }
    }

    Session.set("tiles", tiles);
    Session.set("next_tile", 2);
  }

  // TODO (P1): Refactor this mess
  // Gameplay
  $(window).on('keydown', function(e) {

    var tiles = Session.get("tiles");
    var original_tiles = JSON.parse(JSON.stringify(tiles));

    switch(e.which) {
      case LEFT:
        for (var i = 0; i <= 3; i++) {
          for (var j = 0; j <= 3; j++) {
            if (j == 0) continue; // Edge
            else if (tiles[i][j] == 0) continue; // Empty space
            else if (tiles[i][j - 1] != tiles[i][j]) {
              if (tiles[i][j - 1] == 0) {
                tiles[i][j - 1] = tiles[i][j];
                tiles[i][j] = 0;
              }
              else if ((tiles[i][j - 1] == 1 && tiles[i][j] == 2) ||
                       (tiles[i][j - 1] == 2 && tiles[i][j] == 1)) {
                tiles[i][j - 1] = 3;
                tiles[i][j] = 0;
              }
            }
            else { // Twins
              if (tiles[i][j - 1] == 1 || tiles[i][j - 1] == 2)
                continue;
              tiles[i][j - 1] *= 2;
              tiles[i][j] = 0;
            }
          }
        }
      break;

      case RIGHT:
        for (var i = 3; i >= 0; i--) {
          for (var j = 3; j >= 0; j--) {
            if (j == 3) continue; // Edge
            else if (tiles[i][j] == 0) continue; // Empty space
            else if (tiles[i][j + 1] != tiles[i][j]) {
              if (tiles[i][j + 1] == 0) {
                tiles[i][j + 1] = tiles[i][j];
                tiles[i][j] = 0;
              }
              else if ((tiles[i][j + 1] == 1 && tiles[i][j] == 2) ||
                       (tiles[i][j + 1] == 2 && tiles[i][j] == 1)) {
                tiles[i][j + 1] = 3;
                tiles[i][j] = 0;
              }
            }
            else { // Twins
              if (tiles[i][j + 1] == 1 || tiles[i][j + 1] == 2)
                continue;
              tiles[i][j + 1] *= 2;
              tiles[i][j] = 0;
            }
          }
        }
      break;

      case UP:
        for (var j = 0; j <= 3; j++) {
          for (var i = 0; i <= 3; i++) {
            if (i == 0) continue; // Edge
            else if (tiles[i][j] == 0) continue; // Empty space
            else if (tiles[i - 1][j] != tiles[i][j]) {
              if (tiles[i - 1][j] == 0) {
                tiles[i - 1][j] = tiles[i][j];
                tiles[i][j] = 0;
              }
              else if ((tiles[i - 1][j] == 1 && tiles[i][j] == 2) ||
                       (tiles[i - 1][j] == 2 && tiles[i][j] == 1)) {
                tiles[i - 1][j] = 3;
                tiles[i][j] = 0;
              }
            }
            else { // Twins
              if (tiles[i - 1][j] == 1 || tiles[i - 1][j] == 2)
                continue;
              tiles[i - 1][j] *= 2;
              tiles[i][j] = 0;
            }
          }
        }
      break;

      case DOWN:
        for (var j = 0; j <= 3; j++) {
          for (var i = 3; i >= 0; i--) {
            if (i == 3) continue; // Edge
            else if (tiles[i][j] == 0) continue; // Empty space
            else if (tiles[i + 1][j] != tiles[i][j]) {
              if (tiles[i + 1][j] == 0) {
                tiles[i + 1][j] = tiles[i][j];
                tiles[i][j] = 0;
              }
              else if ((tiles[i + 1][j] == 1 && tiles[i][j] == 2) ||
                       (tiles[i + 1][j] == 2 && tiles[i][j] == 1)) {
                tiles[i + 1][j] = 3;
                tiles[i][j] = 0;
              }
            }
            else { // Twins
              if (tiles[i + 1][j] == 1 || tiles[i + 1][j] == 2)
                continue;
              tiles[i + 1][j] *= 2;
              tiles[i][j] = 0;
            }
          }
        }
      break;

      default: return;
    }

    e.preventDefault();

    if (_.isEqual(tiles, original_tiles)){
      return; // invalid move
    }

    new_tile(e.which, tiles);
  });

  // TODO (P1): Calibrate (location and rank)
  function new_tile(direction, tiles) {
    var locs = [];

    switch(direction) {
      case LEFT: // Right column
        var j = 3;
        for (var i = 0; i <= 3; i++) {
          if (tiles[i][j] == 0)
            locs.push({i: i, j: j});
        }
      break;

      case RIGHT: // Left column
        var j = 0;
        for (var i = 0; i <= 3; i++) {
          if (tiles[i][j] == 0)
            locs.push({i: i, j: j});
        }
      break;

      case UP: // Bottom column
        var i = 3;
        for (var j = 0; j <= 3; j++) {
          if (tiles[i][j] == 0)
            locs.push({i: i, j: j});
        }
      break;

      case DOWN: // Top column
        var i = 0;
        for (var j = 0; j <= 3; j++) {
          if (tiles[i][j] == 0)
            locs.push({i: i, j: j});
        }
      break;
    }

    var loc = _.sample(locs);

    // TODO (P1): Fix this (invalid move != no more moves)
    if (!loc) {
      lost();
      return;
    }

    tiles[loc.i][loc.j] = Session.get("next_tile");
    Session.set("tiles", tiles);

    function random_tile() {
      var probs = [1, 1, 1, 2, 2, 2, 3, 3, 3, 6, 6, 12, 24];
      var ind = Math.floor(Math.random() * probs.length);
      return probs[ind];
    }

    Session.set("next_tile", random_tile());
  }

  // TODO (P1): Calculate score like actual Threes
  // TODO (P1): Make this cute
  function lost() {
    var tiles = Session.get("tiles");
    var score = _.reduce(_.flatten(tiles), function(acc, x) {return acc + x;}, 0);
    alert("No more moves! Your score is " + score + " ^__^");
    new_game();
  }

  new_game();
}