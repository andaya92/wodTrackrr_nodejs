import io from 'socket.io-client'

export default io({
	path: '/socket.io',
 	reconnection: true
})
