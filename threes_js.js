if (Meteor.isClient) {

  // TODO: Randomly instantiate tiles
  var tiles = [[0, 0, 0, 2], [1, 0, 0, 0], [0, 3, 0, 0], [0, 3, 0, 0]];
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

  // TODO: New tiles
  // TODO: Refactor (this mess is embarrassing)
  $(window).on('keydown', function(e) {
    var tiles = Session.get("tiles");
    switch(e.which) {
      case 37: // Left
        console.log("left");
        for (var i = 0; i <= 3; i++) {
          for (var j = 0; j <= 3; j++) {
            var stuck = false;
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
            else {
              tiles[i][j - 1] *= 2; // Twins
              tiles[i][j] = 0;
            }
          }
        }
        break;

      case 39: // Right
        console.log("right");
        for (var i = 3; i >= 0; i--) {
          for (var j = 3; j >= 0; j--) {
            var stuck = false;
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
            else {
              tiles[i][j + 1] *= 2; // Twins
              tiles[i][j] = 0;
            }
          }
        }
        break;

      case 38: // Up
        console.log("up");
        for (var j = 0; j <= 3; j++) {
          for (var i = 0; i <= 3; i++) {
            var stuck = false;
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
            else {
              tiles[i - 1][j] *= 2; // Twins
              tiles[i][j] = 0;
            }
          }
        }
        break;

      case 40: // Down
        console.log("down");
        for (var j = 0; j <= 3; j++) {
          for (var i = 3; i >= 0; i--) {
            var stuck = false;
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
            else {
              tiles[i + 1][j] *= 2; // Twins
              tiles[i][j] = 0;
            }
          }
        }
        break;

      default:
        return;
    }
    Session.set("tiles", tiles);
    e.preventDefault();
  });

}