var io = require('socket.io').listen(3000)

io.on('connection', function(socket) {
	console.log('a user connected')

	socket.on('data', data => {
		console.log('Received data:', data)
	})

	socket.on('disconnect', () => {
		console.log('a user disconnected')
	})
})
