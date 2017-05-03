// A node of a quad tree, meant to be used by the hashlife implementation
class QuadTree {
	constructor(board, id = 0, children = undefined) {
		// Back reference to board state
		this.board = board

		// Unique identifier for this node
		this.id = id

		// [nw, ne, sw, se]
		this.children = children

		// Depth in tree
		this.level = 0

		// Number of live cells in this node
		this.count = id

		// Not just an initial cell
		if (id > 1 && children) {
			// 1 more than any of its children
			this.level = nw.level + 1

			// Add up children counts
			this.count = nw.count + ne.count + sw.count + se.count
		}
	}

	// Getters for specific children
	get nw() {
		return this.children[0]
	}

	get ne() {
		return this.children[1]
	}

	get sw() {
		return this.children[2]
	}

	get se() {
		return this.children[3]
	}

	// Returns the power of 2 of the current depth of the tree
	get width() {
		return Math.pow(2, this.level)
	}

	// Calculates the next state of a particular cell, based on number of live neighbors
	score(state, neighbors) {
		if ((state === 1 && neighbors === 2) || neighbors === 3) {
			return 1
		}
		return 0
	}

	// Returns the state of the cell at this position
	get(x, y) {
		// Found the child containing the cell, so return its state
		if (this.level === 0) {
			return this.state
		}

		// Calculate child index based on position
		let halfSize = Math.floor(this.width / 2)
		let childIndex = Math.floor(x / halfSize) + (Math.floor(y / halfSize) * 2)

		// Recurse down one level
		return this.children[childIndex].get(x % halfSize, y % halfSize)
	}

	set(x, y, state) {
		// Reached the cell that needs to be set
		// Return an already allocated cell, either alive or dead based on state
		if (this.level === 0) {
			return this.board.baseCell(state)
		}
	}
}

// Similar to LifeBoard
// Hashlife implementation
class BoardHashlife extends Board {
	constructor() {
		super()

		// Setup base cells
		this.baseCells = [new QuadTree()]

		this.root = new QuadTree()
	}

	clear() {
		this.root = new QuadTree()
		this.clearCanvas()
	}

	draw() {
		// Iterate through quadtree and draw data in leaf nodes

		// Draw canvas data, and update population display
		super.draw()
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

	baseCell(state) {

	}
}
