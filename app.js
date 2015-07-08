function newBox(g){
//create a box with a random value at a random location
	var nbox = document.createElement("div");
	$(nbox).addClass("box");
	rand = Math.random();
	//determine box number
	if(rand <= .5){
		val = 2;
		$(nbox).addClass("b2");
		$(nbox).html("2");
	} else {
		val = 4;
		$(nbox).addClass("b4");
		$(nbox).html("4");
	}
	//determine position of box;
	//find number of blocks in the grid
	spaces = 0;
	for(i=0; i<g.length; i++){
		for(j=0; j<g[0].length; j++){
			if(g[i][j] == 0){
				spaces++; 
			}
		}
	}
	space = Math.floor(Math.random()*spaces);
	s = 0;
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
}
function merge(row, col, val){
	//function to merge two boxes with the same number
	//creates a block with the new val at the given position
	console.log("b", row, col, val);
	var nbox = document.createElement("div");
	$(nbox).addClass("box");
	$(nbox).addClass("b" + val);
	$(nbox).html(val.toString());
	$(nbox).addClass("row" + row);
	$(nbox).addClass("col" + col);
	$("#game").append(nbox);
}

function moveLeft(row, col, g){
	//if there is space for the block to move
	box = $(".row" + String(row)+".col"+String(col));
	var val = g[row][col];
	rclass = "row" + String(row);
	cclass = "col" + String(col);
	newcclass = "col" + String(col - 1);
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
			boxes = $(".row" + String(row)+".col"+String(col-1));
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
			g[row][col-1] = val*2;
			return true;
		} else { //if they do not have the same value
			return; //the block has moved as far as it can
		}
	}
}

function moveRight(row, col, g){
	box = $(".row" + String(row)+".col"+String(col));
	var val = g[row][col];
	rclass = "row" + String(row);
	cclass = "col" + String(col);
	newcclass = "col" + String(col + 1);
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
			boxes = $(".row" + String(row)+".col"+String(col+1));
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
			g[row][col+1] = val*2;
			return true;
		} else { //if they do not have the same value
			return; //the block has moved as far as it can
		}
	}
}

function moveUp(row, col, g){
	box = $(".row" + String(row)+".col"+String(col));
	var val = g[row][col];
	rclass = "row" + String(row);
	cclass = "col" + String(col);
	newcclass = "row" + String(row - 1);	
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
			boxes = $(".row" + String(row-1)+".col"+String(col));
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
			g[row-1][col] = val*2;
			return true;
		} else { //if they do not have the same value
			return; //the block has moved as far as it can
		}
	}
}

function moveDown(row, col, g){
	box = $(".row" + String(row)+".col"+String(col));
	var val = g[row][col];
	rclass = "row" + String(row);
	cclass = "col" + String(col);
	newcclass = "row" + String(row + 1);	
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
			boxes = $(".row" + String(row+1)+".col"+String(col));
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
			g[row+1][col] = val*2;
			return true;
		} else { //if they do not have the same value
			return; //the block has moved as far as it can
		}
	}
}

$(document).keydown(function(e) {
	// length = box width + margin
	g = grid;
	moves = false; //if there are no possible moves with an arrow press, a new box will not spawn
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
						//console.log("left", i,j);
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
						//console.log("up", i,j);
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
						//console.log("right", i,j);
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
						//console.log("down", i,j);
					}				
				}
			}
        break;

        default: return; // exit this handler for other keys
    }
	
    e.preventDefault(); // prevent the default action (scroll / move caret)
	if(moves){setTimeout(function(){newBox(g);}, 350);};
	$("#g0").html(g[0]);
	$("#g1").html(g[1]);
	$("#g2").html(g[2]);
	$("#g3").html(g[3]);
	check_end(g);
	}, 0);
	},0)
});
function check_end(g){
	//check if the board shows a win or loss
	lose = true;
	win = false;
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
	if(win){
		$("#win").css("display", "block");
	}
	else if(lose){
		$("#lose").css("display", "block");
	}
}


