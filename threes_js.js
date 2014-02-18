LEFT = 37;
RIGHT = 39;
UP = 38;
DOWN = 40;

if (Meteor.isClient) {

  // TODO (P1): Calibrate
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

  Template.game.rows = function() {
    return Session.get("tiles");
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

  // TODO (P0): Display next tile
  // TODO (P0): End game when done
  // TODO (P1): Calibrate (location and rank)
  function random_tile() {
    var probs = [1, 1, 1, 2, 2, 2, 3, 3, 3, 6, 6, 12, 24];
    var ind = Math.floor(Math.random() * probs.length);
    return probs[ind];
  }

  function next_tile(direction, tiles) {
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
    if (!loc) {
      alert("YOU LOST!");
    }
    else {
      tiles[loc.i][loc.j] = random_tile();
    }
    Session.set("tiles", tiles);
  }

  // TODO (P1): Refactor (this mess is embarrassing as f)
  $(window).on('keydown', function(e) {
    var tiles = Session.get("tiles");

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
    next_tile(e.which, tiles);
  });

}