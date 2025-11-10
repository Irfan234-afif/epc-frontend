import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_SOCKET_URL, {
  withCredentials: true,
  autoConnect: false,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  timeout: 20000,
  extraHeaders: {
	'X-Frappe-Origin': import.meta.env.VITE_BACKEND_URL
  }
});

async function initSocket(){
	// Remove existing listeners to prevent duplicates
	socket.off('connect');
	socket.off('disconnect');
	socket.off('connect_error');
	socket.off('transaction_completed');
	socket.off('authenticated');
	socket.off('unauthorized');
	socket.offAny();

	socket.on('connect', () => {
		console.log('✅ Socket connected');
	});

	socket.on('disconnect', (reason) => {
		console.log('❌ Socket disconnected:', reason);
	});

	socket.on('connect_error', (error) => {
		console.error('❌ Socket connection error:', error.message);
	});

	socket.onAny((event, data) => {
		console.log('📡 Socket event received:', event, 'Data:', data);
	});

	// Connect the socket
	socket.connect();

}

const transaction_room = (card_id) => {
  return `transaction:card:${card_id}`;
}

export { socket, initSocket, transaction_room };