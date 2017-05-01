class QuadTree {
	constructor() {
		// nw, ne, sw, and se - these will be children
	}
}

// Hashlife implementation
class BoardHashlife extends Board {
	constructor() {
		super()
		this.root = new QuadTree()
	}

	clear() {
		this.root = new QuadTree()
		this.clearCanvas()
	}

	draw() {
		// Iterate through quadtree and draw data in leaf nodes
	}

	addCell(cell) {
		let pos = unhash(cell)

		// Set bit in quadtree, will need to recurse down to the correct location
	}

	simulate(stepSize = 1) {
		this.generation += stepSize
		this.population = 0

		// Step forward using hashlife algorithm
	}

	serialize() {
		// Serialize quadtree data back into an array of live cell positions
		return '[]'
	}
}
