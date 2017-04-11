let simulate = false
let board = undefined
let stepSize = 1

function init() {
	let listener = new window.keypress.Listener()

	// Setup initial board
	board = new BoardNaive();
	//board.importPattern('somepatternfile')
	//board.draw()

	var canvas = document.getElementById("board");

	canvas.addEventListener('dragover',cancel);
	canvas.addEventListener('dragenter',cancel);
	canvas.addEventListener('drop',read);

	function cancel(e) {
	   e.preventDefault();
	}
	function read(e){
		e = e || window.event;
		cancel(e);
		e.stopPropagation();

		var files = e.dataTransfer.files; // Array of all files
		readFiles(files);
		board.draw();
	}

	// Press enter to go forward by the step size
	listener.register_combo({
		'keys': 'enter',
		'on_keydown': () => {
			board.simulate(stepSize)
			board.draw()
		}
	})

	listener.simple_combo('r', () => {
		//board.importPattern()
		board.addCell('20, 20')
		board.addCell('20, 21')
		board.addCell('21, 20')
		board.addCell('21, 21')
		board.draw()
	})

	// Start loop
	requestAnimationFrame(loop)
}

function readFiles(files){
	if(files.length<=0)//Length is zero! How the hell did that happen?
		return;
	var first = true;
	var file=files[0];
	var reader = new FileReader();
	reader.file=file;
	reader.onload = function(e2) { // finished reading file data.
		//Print out the file
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

		// Clear the board, import the pattern, and draw it
		board.clear()
		board.importPattern(finished)
		board.draw()
	}
	reader.readAsText(file); // start reading the file data.
}

function loop() {
	if (simulate) {
		board.simulate(stepSize)
		board.draw()
	}
	requestAnimationFrame(loop)
}

// Handles changing the step size input by only a power of 2
function handleLog2Input() {
	let num = parseInt(document.getElementById("step-size").value)
	let result = 0
	if (num < stepSize) {
		result = Math.pow(2, Math.floor(Math.log2(num)))
	} else {
		result = Math.pow(2, Math.ceil(Math.log2(num)))
	}
	if (isNaN(result)) {
		result = 1
	}
	stepSize = result
	document.getElementById("step-size").value = result
}

function toggleSimulate() {
	simulate = !simulate
	let text = simulate ? 'Stop' : 'Run'
	document.getElementById('run').value = text
}

window.onload = init
