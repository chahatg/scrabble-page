var tiles = [
  {"letter":"A", "value":1,  "amount":9},
  {"letter":"B", "value":3,  "amount":2},
  {"letter":"C", "value":3,  "amount":2},
  {"letter":"D", "value":2,  "amount":4},
  {"letter":"E", "value":1,  "amount":12},
  {"letter":"F", "value":4,  "amount":2},
  {"letter":"G", "value":2,  "amount":3},
  {"letter":"H", "value":4,  "amount":2},
  {"letter":"I", "value":1,  "amount":9},
  {"letter":"J", "value":8,  "amount":1},
  {"letter":"K", "value":5,  "amount":1},
  {"letter":"L", "value":1,  "amount":4},
  {"letter":"M", "value":3,  "amount":2},
  {"letter":"N", "value":1,  "amount":6},
  {"letter":"O", "value":1,  "amount":8},
  {"letter":"P", "value":3,  "amount":2},
  {"letter":"Q", "value":10, "amount":1},
  {"letter":"R", "value":1,  "amount":6},
  {"letter":"S", "value":1,  "amount":4},
  {"letter":"T", "value":1,  "amount":6},
  {"letter":"U", "value":1,  "amount":4},
  {"letter":"V", "value":4,  "amount":2},
  {"letter":"W", "value":4,  "amount":2},
  {"letter":"X", "value":8,  "amount":1},
  {"letter":"Y", "value":4,  "amount":2},
  {"letter":"Z", "value":10, "amount":1},
  {"letter":"_", "value":0,  "amount":2}
];

// JavaScript array of objects to determine what letter each piece is.
var gamePieces = [
  {"id": "tile0", "letter": "A"},
  {"id": "tile1", "letter": "B"},
  {"id": "tile2", "letter": "C"},
  {"id": "tile3", "letter": "D"},
  {"id": "tile4", "letter": "E"},
  {"id": "tile5", "letter": "F"},
  {"id": "tile6", "letter": "G"}
]

// JavaScript object to keep track of the game board.
// NOTE: "pieceX" means NO tile present on that drop zone.
var gameBoard = [
  {"id": "drop0",  "piece": "tileX"},
  {"id": "drop1",  "piece": "tileX"},
  {"id": "drop2",  "piece": "tileX"},
  {"id": "drop3",  "piece": "tileX"},
  {"id": "drop4",  "piece": "tileX"},
  {"id": "drop5",  "piece": "tileX"},
  {"id": "drop6",  "piece": "tileX"},
  {"id": "drop7",  "piece": "tileX"},
  {"id": "drop8",  "piece": "tileX"},
  {"id": "drop9",  "piece": "tileX"},
  {"id": "drop10", "piece": "tileX"},
  {"id": "drop11", "piece": "tileX"},
  {"id": "drop12", "piece": "tileX"},
  {"id": "drop13", "piece": "tileX"},
  {"id": "drop14", "piece": "tileX"}
]

function findWord() {
  var word = "";
  var score = 0;

  // Go through the whole game board and generate a possible word.
  for(var i = 0; i < 15; i++) {
    if(gameBoard[i].piece != "tileX") {
      word += findLetter(gameBoard[i].piece);
      score += findScore(gameBoard[i].piece);
    }
  }

  // Factor in the doubling of certain tiles. Since the should_double() function returns 0 or 1,
  // this is easy to account for. If it's 0, 0 is added to the score. If it's 1, the score is doubled.
  score += (score * shouldDouble());

  // Put the score of the dropped tile into the HTML doc.
  $("#score").html(score);

  // If the word is not empty, show it on the screen!
  if(word != "") {
    $("#word").html(word);
    return;
  }

  // Otherwise the word is now blank.
  $("#word").html("____");
}


// Determine whether to double the word score or not.
// Returns 1 for YES or 0 for NO.
function shouldDouble() {
  if(gameBoard[2].piece != "tileX") {
    return 1;
  }
  if(gameBoard[12].piece != "tileX") {
    return 1;
  }

  // Otherwise return 0.
  return 0;
}


/**
 *    This function, given a letter, will return the letter's score based on
 *    the value in the pieces.json file.
 *
 *    parameters: an ID of a tile
 *       returns: integer score, such as "1" or "2". On error, returns "-1".
 */
function findScore(given_id) {
  // First figure out which letter we have.
  var letter = findLetter(given_id);
  var score = 0;

  // Since each "letter" is actually a spot in an array in the pieces.json file,
  // we gotta look at each object in the array before we can look at stuff.
  for(var i = 0; i < 27; i++) {
    // Get an object to look at.
    var obj = tiles[i];

    // See if this is the right object.
    if(obj.letter == letter) {
      score = obj.value;

      // Need to determine if this piece is a DOUBLE or not.
      // Droppable zones 6 & 8 are DOUBLE letter scores.
      score += (score * shouldDoubleLetter(given_id));

      return score;
    }
  }

  // If we get here, then we weren't given a nice valid letter. >:(
  return -1;
}


// Given a tile ID, figures out which dropID this is and whether to double the
// letter score or not.
// Returns 1 for YES or 0 for NO.
function shouldDoubleLetter(given_id) {
  // Figure out which dropID this tile belongs to.
  var dropID = findTilePos(given_id);

  // Is this dropID a double spot or not?
  if(dropID == "drop6" || dropID == "drop8") {
    // YES, return 1.
    return 1;
  }

  // Otherwise, NO, so return 0.
  return 0;
}


/**
 *    This function, given a piece ID will return which letter it represents.
 *
 *    parameters: an ID of a tile
 *       returns: the letter that tile represents. On error, returns "-1".
 */
function findLetter(given_id) {
  // Go through the 7 pieces,
  for(var i = 0; i < 7; i++) {
    // If we found the piece we're looking for, awesome!
    if(gamePieces[i].id == given_id) {
      // Just return its letter!
      return gamePieces[i].letter;
    }
  }

  // If we get here, we weren't given a nice draggable ID like "piece1", so return -1
  return -1;
}


// Give this function a droppable ID and it returns which position in the array it is.
function findBoardPos(given_id) {
  for(var i = 0; i < 15; i++){
    if(gameBoard[i].id == given_id) {
      return i;
    }
  }

  // Errors return -1.
  return -1;
}


// Given a tile, figure out which drop_ID it belongs to.
function findTilePos(given_id) {
  for(var i = 0; i < 15; i++){
    if(gameBoard[i].tile == given_id) {
      return gameBoard[i].id;
    }
  }

  // Errors return -1.
  return -1;
}


/**
 *    This function loads up the scrabble pieces onto the rack.
 *    It also makes each of them draggable and sets various properties, including
 *    the images location and class / ID.
 *
 *    the tile IDs are in the form "piece#", where # is between 1 and 7.
 *
 */
function load_scrabble_tiles() {
  // I'm so used to C++ that I like defining variables at the top of a function. *shrugs*
  var base_url = "img/Scrabble/Tile_";   // base URL of the image
  var random_num = 1;
  var tile = "<img class='tiles' id='tile" + i + "' src='" + base_url + random_num + ".jpg" + "'></img>";
  var tile_ID = "";
  var what_tile = "";

  // Load up 7 pieces
  for(var i = 0; i < 7; i++) {
    // Get a random number so we can generate a random tile. There's 27 tiles,
    // so we want a range of 0 to 26. Also make sure not to over use any tiles,
    // so generate multiple random numbers if necessary.
    var loop = true;
    while(loop == true){
      random_num = getRandomInt(0, 26);

      // Need to make sure we remove words from the pieces data structure.
      if(tiles[random_num].amount != 0) {
        loop = false;
        tiles[random_num].amount--;
      }
    }



    // Make the img HTML and img ID so we can easily append the tiles.
    tile = "<img class='tiles' id='tile" + i + "' src='" + base_url + tiles[random_num].letter + ".jpg" + "'></img>";
    tile_ID = "#tile" + i;
    gamePieces[i].letter = tiles[random_num].letter;

    // Reposition the tile on top of the rack, nicely in a row with the other tiles.

    // We first get the rack's location on the screen. Idea from a Stackoverflow post,
    // URL: https://stackoverflow.com/questions/885144/how-to-get-current-position-of-an-image-in-jquery
    var pos = $("#playerRack").position();

    // Now figure out where to reposition the board piece.
    // For left, the -200 shifts the tiles over 200px from the edge of the rack. the (50 * i) creates 50px gaps between tiles.
    // For top, the -130 shifts the tiles up 130px from the bottom of the rack.
    var img_left = -165 + (50 * i);
    var img_top = -130;

    /* Load onto the page and make draggable.
       The height / width get set using these tricks:
       https://stackoverflow.com/questions/10863658/load-image-with-jquery-and-append-it-to-the-dom
       https://stackoverflow.com/questions/2183863/how-to-set-height-width-to-image-using-jquery
       https://stackoverflow.com/questions/9704087/jquery-add-image-at-specific-co-ordinates

       The relative stuff came from this w3schools page. I realized I could set the top and left
       relative to the rack (and the board for the droppable targets), which makes things wayyyyy
       easier. URL: http://www.w3schools.com/css/css_positioning.asp
    */
    // Add the piece to the screen
    $("#rack").append(tile);

    // Move the piece relative to where the rack is located on the screen.
    $(tile_ID).css("left", img_left).css("top", img_top).css("position", "relative");

    // Make the piece draggable.
    $(tile_ID).draggable();
  }
}


/**
 *    This function will load up targets for the images to be dropped onto.
 *    I figure they will be transparent images that are overlayed on top of
 *    the game board.
 *
 *    TODO: figure out the size of these targets - maybe 50px by 50px?
 *          also create transparent image of that size to load up.
 *          should probabl
 *
 *    height should be 80px
 *    width should be 75px
 */
function load_droppable_targets() {
  var img_url = "img/Scrabble/Scrabble_Droppable.png";   // URL of the image
  var drop = "<img class='droppable' id='drop" + i + "' src='" + img_url + "'></img>";
  var drop_ID = "#drop" + i;

  for(var i = 0; i < 15; i++) {
    drop = "<img class='droppable' id='drop" + i + "' src='" + img_url + "'></img>";
    drop_ID = "#drop" + i;

    // ** The position stuff is similar to the tile function above. **
    // Get board location.
    var pos = $("#the_gameBoard").position();

    // Figure out where to put the droppable targets.
    var img_left = 0;
    var img_top = -125;

    // Add the img to the screen.
    $("#board").append(drop);

    // Reposition the img relative to the board.
    $(drop_ID).css("left", img_left).css("top", img_top).css("position", "relative");

    // Make the img droppable
    $(drop_ID).droppable({
      // Found this on the jQuery UI doc page, at this URL: https://jqueryui.com/droppable/#default
      // When a tile is placed on a droppable zone, set the game_board var to hold that tile.
      drop: function(event, ui) {
        // To figure out which draggable / droppable ID was activated, I used this sweet code
        // from stackoverflow:
        // https://stackoverflow.com/questions/5562853/jquery-ui-get-id-of-droppable-element-when-dropped-an-item
        var draggableID = ui.draggable.attr("id");
        var droppableID = $(this).attr("id");

        // Log this stuff for debugging.
        console.log("Tile: " + draggableID + " - dropped on " + droppableID);

        // Mark that a tile was dropped in the game_board variable.
        gameBoard[findBoardPos(droppableID)].piece = draggableID;

        // Figure out what word, if any, the user currently entered.
        findWord();
      },
      // When a tile is moved away, gotta remove it from the game board.
      // Helpful info: https://api.jqueryui.com/droppable/#event-out
      out: function(event, ui) {
        var draggableID = ui.draggable.attr("id");
        var droppableID = $(this).attr("id");

        // See if this is a false alarm - someone moving tiles over this one by mistake.
        // This is necessary to prevent "removing" of tiles by accident if another tile
        // clips one that isn't being removed.
        if(draggableID != gameBoard[findBoardPos(droppableID)].piece) {
          // We found that someone did not actually move the tile outside of
          // the drop zone, so this was clearly a mistake (clipping issue likely)
          // So just log it and return to prevent accidently removing a valid tile.
          console.log("FALSE ALARM DETECTED.");
          return;
        }

        // Log this stuff for debugging.
        console.log("Tile: " + draggableID + " - removed from " + droppableID);

        // Mark that a tile was removed in the game_board variable.
        gameBoard[findBoardPos(droppableID)].piece = "tileX";

        // Update the word that was just found.
        findWord();
      }
    });
  }
}

/**
 * Returns a random integer between min (inclusive) and max (inclusive)
 * Using Math.round() will give you a non-uniform distribution!
 *
 * I did not originally write this, it is from this Stackoverflow post:
 * URL: https://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
