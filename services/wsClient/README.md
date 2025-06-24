# WebSocket Client

This is a TypeScript port of the Dart WebSocket client for the Nexus application. It provides a robust WebSocket connection with automatic reconnection, message handling, and join request management.

## Features

- **Singleton Pattern**: Single WebSocket service instance across the application
- **Automatic Reconnection**: Exponential backoff with jitter for reliable reconnection
- **Message Routing**: Centralized message handling and routing
- **Join Request Management**: Handles outpost join requests with timeouts
- **Connection State Management**: Tracks connection state and provides status information
- **Ping/Pong**: Automatic heartbeat to keep connections alive
- **Colorful Logging**: Development-only colored console logs for easy debugging

## Configuration

### WebSocket Server URL

The WebSocket client needs to know the server URL. You can configure it using environment variables:

#### For Next.js:

```bash
# .env.local
NEXT_PUBLIC_WEBSOCKET_URL=wss://your-server.com/ws
```

#### For React (Create React App):

```bash
# .env
REACT_APP_WEBSOCKET_URL=wss://your-server.com/ws
```

#### For Node.js:

```bash
# .env
WEBSOCKET_URL=wss://your-server.com/ws
```

#### Default Fallback:

If no environment variable is set, it defaults to `wss://localhost:8080/ws`

### User Store Integration

The service needs access to the current user's address for join request management:

```typescript
// TODO: Replace with your actual user store
const userAddress = getUserAddress(); // Get from your user store
```

## Usage

### Basic Setup

```typescript
import { WebSocketService } from "./services/wsClient";

// Get the singleton instance
const wsService = WebSocketService.instance;

// Connect to WebSocket server
const success = await wsService.connect(token, websocketAddress);
```

### Sending Messages

```typescript
import { OutgoingMessageType } from "./services/wsClient";

// Send a join message
await wsService.send({
  message_type: OutgoingMessageType.JOIN,
  outpost_uuid: "outpost-id",
});

// Send a reaction
await wsService.send({
  message_type: OutgoingMessageType.LIKE,
  outpost_uuid: "outpost-id",
  data: {
    react_to_user_address: "user-address",
    amount: 1.0,
  },
});
```

### Joining Outposts

```typescript
// Join an outpost with automatic retry
const success = await wsService.asyncJoinOutpostWithRetry("outpost-id");

// Force join (ignore if already joined)
const success = await wsService.asyncJoinOutpost("outpost-id", true);
```

### Monitoring Connection Status

```typescript
// Check connection state
console.log(wsService.connectionState); // 'disconnected' | 'connecting' | 'connected'
console.log(wsService.connected); // boolean
console.log(wsService.isConnecting); // boolean

// Get detailed status
const status = wsService.connectionStatus;
console.log(status);
// {
//   state: 'connected',
//   isConnecting: false,
//   connected: true,
//   hasChannel: true,
//   hasToken: true
// }
```

### Listening to Join Events

```typescript
// Listen for join completions
wsService.joinStream.addEventListener("join", (event) => {
  const joinId = event.detail;
  console.log("Join completed:", joinId);
});
```

## Architecture

### Core Components

1. **WebSocketService**: Main service class that orchestrates all components
2. **ConnectionManager**: Handles connection lifecycle and reconnection logic
3. **JoinRequestManager**: Manages join requests with timeouts and retries
4. **WebSocketMessageRouter**: Routes incoming messages to appropriate handlers
5. **Lock**: Provides synchronization for concurrent operations

### Message Types

#### Incoming Messages

- User joined/left events
- User reactions (like, dislike, boo, cheer)
- Speaking state changes
- Recording state changes
- Time updates
- Waitlist updates
- Creator events

#### Outgoing Messages

- Join/leave outpost
- Send reactions
- Start/stop speaking
- Start/stop recording
- Wait for creator

## Controller Integration

The message router contains TODO comments for controller integration. You'll need to:

1. Replace controller calls with your actual controller/storage system
2. Implement user store access
3. Set up proper error handling and toast notifications
4. Configure the WebSocket server address via environment variables

## Error Handling

The service includes comprehensive error handling:

- Connection timeouts
- Message parsing errors
- Reconnection failures
- Join request timeouts

All errors are logged and the service attempts to recover automatically where possible.

## Testing

The service is designed to be testable with dependency injection for:

- Logger implementation
- User store access
- Controller integration
- WebSocket server configuration

## Migration Notes

This TypeScript version maintains the same API as the original Dart implementation, making migration straightforward. Key differences:

- Uses native WebSocket instead of web_socket_channel
- Uses EventTarget instead of RxDart streams
- Uses Node.js timers instead of Dart timers
- Simplified logger interface
- Colorful development logging
