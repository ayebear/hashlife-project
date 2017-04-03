import BoardHashlife from 'board_hashlife.js'
import BoardNaive from 'board_naive.js'

let simulate = false
let board = undefined
let generation = 1

function init() {
	let listener = new window.keypress.Listener()

	// Setup initial board
	board = new BoardNaive();
	//board.importPattern('somepatternfile')
	//board.draw()
	
	console.log("Test3");
	
	var canvas = document.getElementById("board");
	
	canvas.addEventListener('dragover',cancel);
	canvas.addEventListener('dragenter',cancel);
	canvas.addEventListener('drop',read);

	function cancel(e) {
	   e.preventDefault(); 
	}
	function read(e){
		console.log("Chicken");
		e = e || window.event;
		cancel(e);
		e.stopPropagation();
		
		var files = e.dataTransfer.files; // Array of all files
		readFiles(files);
		board.draw();
	}
	
	// Handle holding enter to simulate
	listener.register_combo({
		'keys': 'enter',
		'on_keydown': () => {
			simulate = true
		},
		'on_keyup': () => {
			simulate = false
		}
	})

	listener.simple_combo('r', () => {
		//board.importPattern()
		board.draw()
	})

	// Start loop
	requestAnimationFrame(loop)
}

function readFiles(files){
	console.log(files);
	if(files.length<=0)//Length is zero! How the hell did that happen?
		return;
	var first = true;
	var file=files[0];
	var reader = new FileReader();
	reader.file=file;
	reader.onload = function(e2) { // finished reading file data.
		//Print out the file
		console.log(e2.target.result);
		var lines = e2.target.result.split('\n');
		var filtered = [];
		//Remove any lines that have a #
		for(var i=0;i<lines.length;i++) {
			if(lines[i].indexOf('#')==-1)
				filtered.push(lines[i]);
		}
		var result="";
		//Put the rest of the lines in one string
		for(var i=1;i<filtered.length;i++){
			result+=filtered[i];
		}
		var finished = [];
		finished.push(filtered[0]);
		//Split the lines along the $ and put them in with the dimensions line
		var resultsSplit = result.split('$');
		for(var i=0;i<resultsSplit.length;i++){
			finished.push(resultsSplit[i]);
		}
		console.log("Running import on filtered");
		board.importPattern(finished);
		
		
		
	}
	reader.readAsText(file); // start reading the file data.
}

function loop() {
	if (simulate) {
		board.simulate(generation++)
		board.draw()
	}
	requestAnimationFrame(loop)
}

window.onload = init
