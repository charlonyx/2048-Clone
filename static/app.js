$(document).ready(function(){
	get_high_scores();
	update_scoreboard();
	
	//Start new game on load
	newGame();

	//Continue old game beyond score 2048
	$("#continue").on("click", function(){
		$("#win").css("display", "none");
		after2048 = 1;
	})
	
	//Start New Game
	$(".newgame").on("click", function(){
		newGame();
		$(".over").css("display", "none");
	});
	
	//submit name for high score
	$("#submiths").on("click", function(){
		name = $("#nameinput").val();
		for(i=0; i<high_scores.length; i++){
			if(score > high_scores[i].score){
			//if the score is greater than the lowest high score then it will replace it in the array.
				//put name/score into its place in the high_score array
				high_scores.splice(i, 0, {name:name, score:score});
				high_scores.pop();
				break;
			}
		}
		$.ajax({
			type: "POST",
			url: "/add",
			data:{score:score, name:name},
			success: function(json){
				high_scores = JSON.parse(json);
				update_scoreboard();
			}
		});	
		//hide the "enter your name" div
		$("#hsenter").css("display", "none");
		
		//update the scoreboard
	});
});

function newGame(){
	$(".box").remove();
	after248 = 0;
	score = 0;
	grid = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]];
	newBox(grid);
	newBox(grid);	
}

function newBox(g){
//create a box with a random value at a random location
	var nbox = document.createElement("div");
	$(nbox).addClass("box");
	var rand = Math.random();
	var val;
	//determine box number
	if(rand <= .5){
		val = 2;
		$(nbox).addClass("b2");
		$(nbox).html("2");
		score += 2;
	} else {
		val = 4;
		$(nbox).addClass("b4");
		$(nbox).html("4");
		score += 4;
	}
	//determine position of box;
	//find number of blocks in the grid
	var spaces = 0;
	for(i=0; i<g.length; i++){
		for(j=0; j<g[0].length; j++){
			if(g[i][j] == 0){
				spaces++; 
			}
		}
	}
	var space = Math.floor(Math.random()*spaces);
	var s = 0;
	space_loop:
	for(i=0; i<g.length; i++){
		for(j=0; j<g[0].length; j++){
			if(g[i][j] == 0){
				if(s == space){
					//put in new box
					g[i][j] = val;
					$(nbox).addClass("row" + String(i));
					$(nbox).addClass("col" + String(j));
					break space_loop;
				}
				s++;
			}
		}
	}
//	$(nbox).css("height", "0px");
//	$(nbox).css("width", "0px");
	$("#game").append(nbox);
//	$(nbox).css("height", "110px");
//	$(nbox).css("width", "110px");
	$("#g0").html(g[0]);
	$("#g1").html(g[1]);
	$("#g2").html(g[2]);
	$("#g3").html(g[3]);
	$("#score").html("Score: " + score);
}

function merge(row, col, val){
	//function to merge two boxes with the same number
	//creates a block with the new val at the given position
	var nbox = document.createElement("div");
	$(nbox).addClass("box");
	$(nbox).addClass("b" + val);
	$(nbox).html(val.toString());
	$(nbox).addClass("row" + row);
	$(nbox).addClass("col" + col);
	$("#game").append(nbox);
	//increase score
	score += val;
}

function moveLeft(row, col, g){
	//if there is space for the block to move
	var box = $(".row" + String(row)+".col"+String(col));
	var val = g[row][col];
	var rclass = "row" + String(row);
	var cclass = "col" + String(col);
	var newcclass = "col" + String(col - 1);
	if(g[row][col-1]==0){
		$("." + cclass + "." + rclass).addClass(newcclass);
		$("." + cclass + "." + rclass).removeClass(cclass);
		//update grid
		g[row][col] = 0;
		g[row][col-1] = val;
		//if there is still space
		if(col - 1 != 0){
			moveLeft(row,col-1,g);
		}
		return true;
	} else { //if there is a block in its way
		//if the blocks have the same value
		if(g[row][col-1] == val){
		//merge blocks
			//move block left and delete block
			//update grid
			$("." + cclass + "." + rclass).addClass(newcclass);
			$("." + cclass + "." + rclass).removeClass(cclass);
			var boxes = $(".row" + String(row)+".col"+String(col-1));
			//remove old boxes
			var triggerTime;
			triggerTime	= setTimeout(function(){
				box.trigger("timeoutend");
			}, 350);
			box.on('transitionend webkitTransitionEnd oTransitionEnd timeoutend', function(){
				clearTimeout(triggerTime);
				boxes.remove();
				merge(row,col-1,val*2);		
			});

			g[row][col] = 0;
			g[row][col-1] = (val*2) - 1;
			return true;
		} else { //if they do not have the same value
			return; //the block has moved as far as it can
		}
	}
}

function moveRight(row, col, g){
	var box = $(".row" + String(row)+".col"+String(col));
	var val = g[row][col];
	var rclass = "row" + String(row);
	var cclass = "col" + String(col);
	var newcclass = "col" + String(col + 1);
	//if there is space for the block to move
	if(g[row][col+1]==0){
		$("." + cclass + "." + rclass).addClass(newcclass);
		$("." + cclass + "." + rclass).removeClass(cclass);
		//update grid
		val = g[row][col];
		g[row][col] = 0;
		g[row][col+1] = val;
		//if there is still space
		if(col + 1 < 4){
			moveRight(row,col+1,g);
		}
		return true;
	} else { //if there is a block in its way
		//if the blocks have the same value
		if(g[row][col+1] == val){
		//merge blocks
			//move block left and delete block
			//update grid
			$("." + cclass + "." + rclass).addClass(newcclass);
			$("." + cclass + "." + rclass).removeClass(cclass);
			var boxes = $(".row" + String(row)+".col"+String(col+1));
			//remove old boxes
			var triggerTime;
			triggerTime = setTimeout(function(){
				box.trigger("timeoutend");
			}, 350);
			box.on('transitionend webkitTransitionEnd oTransitionEnd timeoutend', function(){
				boxes.remove();
				merge(row,col+1,val*2);
				clearTimeout(triggerTime);
			});
			g[row][col] = 0;
			g[row][col+1] = (val*2) - 1;
			return true;
		} else { //if they do not have the same value
			return; //the block has moved as far as it can
		}
	}
}

function moveUp(row, col, g){
	var box = $(".row" + String(row)+".col"+String(col));
	var val = g[row][col];
	var rclass = "row" + String(row);
	var cclass = "col" + String(col);
	var newcclass = "row" + String(row - 1);	
	//if there is space for the block to move
	if(g[row - 1][col]==0){
		$("." + cclass + "." + rclass).addClass(newcclass);
		$("." + cclass + "." + rclass).removeClass(rclass);
		//update grid
		val = g[row][col];
		g[row][col] = 0;
		g[row-1][col] = val;
		//if there is still space
		if(row - 1 != 0){
			moveUp(row-1,col,g);
		}
		return true;
	} else { //if there is a block in its way
		//if the blocks have the same value
		if(g[row-1][col] == val){
		//merge blocks
			//move block left and delete block
			//update grid
			$("." + cclass + "." + rclass).addClass(newcclass);
			$("." + cclass + "." + rclass).removeClass(rclass);
			var boxes = $(".row" + String(row-1)+".col"+String(col));
			//remove old boxes
		//	setTimeout(function(){boxes.remove();}, 400);
			var triggerTime;
			triggerTime = setTimeout(function(){
				box.trigger("timeoutend");
			}, 350);
			box.on('transitionend webkitTransitionEnd oTransitionEnd timeoutend', 
			function(){
				clearTimeout(triggerTime);
				boxes.remove();
				merge(row-1,col,val*2);	
			});		
			g[row][col] = 0;
			g[row-1][col] = (val*2) - 1;
			return true;
		} else { //if they do not have the same value
			return; //the block has moved as far as it can
		}
	}
}

function moveDown(row, col, g){
	var box = $(".row" + String(row)+".col"+String(col));
	var val = g[row][col];
	var rclass = "row" + String(row);
	var cclass = "col" + String(col);
	var newcclass = "row" + String(row + 1);	
	//if there is space for the block to move
	if(g[row+1][col]==0){
		$("." + cclass + "." + rclass).addClass(newcclass);
		$("." + cclass + "." + rclass).removeClass(rclass);
		//update grid
		val = g[row][col];
		g[row][col] = 0;
		g[row+1][col] = val;
		//if there is still space
		if(row + 1 < 3){
			moveDown(row+1,col,g);
		}
		return true;
	} else { //if there is a block in its way
		//if the blocks have the same value
		if(g[row+1][col] == val){
		//merge blocks
			//move block left and delete block
			//update grid
			$("." + cclass + "." + rclass).addClass(newcclass);
			$("." + cclass + "." + rclass).removeClass(rclass);
			var boxes = $(".row" + String(row+1)+".col"+String(col));
			//remove old boxes
			var triggerTime;
			triggerTime = setTimeout(function(){
				box.trigger("timeoutend");
			}, 350);
			box.on('transitionend webkitTransitionEnd oTransitionEnd timeoutend', function(){		
				boxes.remove();
				merge(row+1,col,val*2);	
				clearTimeout(triggerTime);
			});

			g[row][col] = 0;
			g[row+1][col] = (val*2) - 1;
			return true;
		} else { //if they do not have the same value
			return; //the block has moved as far as it can
		}
	}
}

$(document).keydown(function(e, after2048) {
	// length = box width + margin
	var g = grid;
	var moves = false; //if there are no possible moves with an arrow press, a new box will not spawn
	//if boxes are moving from a previous turn, make them finish their move
	$(".box").addClass("no-transition");
	setTimeout(function(){
		$(".box").removeClass("no-transition");
	setTimeout(function(){
    switch(e.which) {
        case 37: // left
		//loop through grid to find boxes/
		//starting with left column and moving right
			for(j=1; j<g[0].length; j++){
				for(i=0; i<g.length;i++){
					//for each box
					if(g[i][j]>0){		
						moves = moveLeft(i, j, g);
					}				
				}
			}
        break;

        case 38: // up
		//loop through grid to find boxes/
		//starting with top row and moving down
			for(i=1; i<g.length; i++){
				for(j=0; j<g[0].length;j++){
					//for each box
					if(g[i][j]>0){		
						moves = moveUp(i, j, g);
					}				
				}
			}
        break;

        case 39: // right
		//loop through grid to find boxes/
		//starting with right column and moving left
			for(j=g[0].length - 2; j>-1; j--){
				for(i=0; i<g.length;i++){
					//for each box
					if(g[i][j]>0){		
						moves = moveRight(i, j, g);
					}				
				}
			}
        break;

        case 40: // down
		//loop through grid to find boxes/
		//starting with bottom row and moving up
			for(i=g.length-2; i>-1; i--){
				for(j=0; j<g[0].length;j++){
					//for each box
					if(g[i][j]>0){		
						moves = moveDown(i, j, g);
					}				
				}
			}
        break;

        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
	for(i=0; i<g.length; i++){
		for(j=0; j<g[0].length; j++){
			var old_val = g[i][j];
			if(old_val % 2 != 0){
				g[i][j] = old_val + 1;
			}
		}
	}
	if(moves){
		setTimeout(function(){newBox(g);}, 50);
	};
	$("#score").html("Score: " + score);	
	check_end(g, after2048);
	}, 0);
	},0);
});

function check_end(g, after2048){
	//check if the board shows a win or loss
	var lose = true;
	var win = false;
	for(i=0; i<g.length; i++){
		for(j=0; j<g[0].length; j++){
			if(g[i][j] == 2048){
				//if there is a 2048 on the board, the game has been won
				win = true;
			}
			if(g[i][j] == 0){
				//if there are no spaces on the board, the game has been lost
				lose = false;
			}
		}
	}
	//if there is a 2048 and the board is full, the game is still won
	if(win && after2048 == 0){
		$("#win").css("display", "block");
		high_score_check();
	}
	else if(lose){
		//see if there are possible moves
		var no_moves = true;
		for(i=0; i<g.length - 2; i++){
			for(j=0; j<g[0].length - 2; j++){
				if(i < 3){
					if(g[i][j] == g[i+1][j]){
						no_moves = false;
						break;
					}
				}
				if(j < 3){
					if(g[i][j] == g[i][j+1]){
						no_moves = false;
						break;
					}
				}
			}
		}
		if(no_moves){
			$("#lose").css("display", "block");
			high_score_check();
		}
	}
}

//High Score 
function high_score_check(){
	if(high_scores.length < 10 || score > high_scores[high_scores.length - 1].score){
		//if the score is greater than the lowest high score
		$("#hsenter").css("display", "block");	
	}
}

function get_high_scores(){
	high_scores = [];
	$.ajax({
		url: "/highscores",
		success: function(json){
			high_scores = JSON.parse(json);
		}		
	});
}

function update_scoreboard(){
	$("table tr:not(:first)").remove();
	for(i in high_scores){
		var row = document.createElement("tr");
		var name = document.createElement("td");
		var hs = document.createElement("td");
		$(name).html(high_scores[i].name);
		$(hs).html(high_scores[i].score);
		$(row).append(name);
		$(row).append(hs);
		$("table").append(row);
	}	
}


