import { hash, unhash } from 'utils.js'

// Base class for conway's game of life boards
export default class Board {
	constructor() {
		// Canvas/drawing
		this.canvas = document.getElementById('board')
		this.ctx = this.canvas.getContext('2d')
		this.ctx.imageSmoothingEnabled = false
		this.imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height)
	}

	// TODO: Update to use modulus to support zooming out
	drawCell(position, value) {
		let element = (position.y * -4) * this.canvas.width + (position.x * 4)

		// Red, green, blue, alpha
		this.imageData.data[element] = value
		this.imageData.data[element + 1] = value
		this.imageData.data[element + 2] = value
		this.imageData.data[element + 3] = 255
	}

	// Renders data to canvas
	draw() {
		this.ctx.putImageData(this.imageData, 0, 0)
	}

	importPattern(lines) {
		console.log("Importing pattern, lines:"+lines.length);

		var canvas = document.getElementById("board");
		var canvasWidth = canvas.width;
		var canvasHeight = canvas.height;
		console.log("Canvas dimensions:"+canvasWidth+","+canvasHeight);
		var x=0;
		var y=0;
		//First line contains the dimensions of the pattern
		console.log(lines);
		//The file comes in lines
		var debug="";
		for(var i=1;i<lines.length;i++){

			//First decode the line
			var string = decode(lines[i]);
			console.log(string);
			for(var j=0;j<string.length;j++){
				if(string[j]=='o'){
					debug+="1";
					this.addCell(hash(x+canvasWidth/2, y+canvasHeight/2));
					x=x+1;
				}
				else if(string[j]=='b'){
					debug+="0";
					x=x+1;
				}
			}
			x=0;
			y=y+1;
			debug+="\n";

		}
		console.log(debug);


		function decode (str) {
			return str.replace(/(\d+)(\w)/g,
				function(m,n,c){
					return new Array( parseInt(n,10)+1 ).join(c);
				}
			);
		}
	}
}
