# WebSocket Client

This WebSocket client provides real-time communication capabilities for the application.

## Usage

### Health Check

The `healthCheck` method sends an echo message to the server and waits for a response to verify connection health:

```typescript
import { wsClient } from "services/wsClient";

// Perform a health check
const isHealthy = await wsClient.healthCheck();
if (isHealthy) {
  console.log("WebSocket connection is healthy");
} else {
  console.log("WebSocket connection is unhealthy");
}
```

**Features:**

- 5-second timeout per attempt
- Retries up to 2 times (3 total attempts)
- Automatically reconnects if disconnected
- Uses unique UUID for each health check to prevent conflicts

### Joining Outposts

```typescript
// Reliable join with health checking
const success = await wsClient.asyncJoin(outpostId);
```

### Connection Management

```typescript
// Connect to WebSocket
await wsClient.connect(token);

// Check connection status
const status = wsClient.connectionStatus;

// Close connection
wsClient.close();
```

## Features

- **Simplified Architecture**: All WebSocket functionality consolidated into one class
- **Singleton Pattern**: Single WebSocket service instance across the application
- **Automatic Reconnection**: Exponential backoff with configurable retry limits
- **Message Handling**: Built-in message routing and Redux store integration
- **Asynchronous Join Requests**: Handles outpost joins with timeouts and retries
- **Connection State Management**: Real-time connection status tracking
- **Keep-Alive Ping**: Automatic heartbeat to maintain connections
- **Error Handling**: Comprehensive error handling with user-friendly toast notifications
- **Development Logging**: Clean console logging for debugging

## Quick Start

```typescript
import { wsClient } from "./services/wsClient";

// Connect to WebSocket server
const success = await wsClient.connect(token);

// Send a message
await wsClient.send({
  message_type: OutgoingMessageType.JOIN,
  outpost_uuid: "your-outpost-id",
});

// Join an outpost with retry
const joined = await wsClient.asyncJoinOutpostWithRetry("outpost-id");
```

## Configuration

### Environment Variables

```bash
# .env.local (Next.js)
NEXT_PUBLIC_WEBSOCKET_ADDRESS=wss://your-server.com/ws
```

## API Reference

### Connection Management

```typescript
// Connect to server
await wsClient.connect(token: string, address?: string): Promise<boolean>

// Check connection status
wsClient.connected: boolean
wsClient.isConnecting: boolean
wsClient.connectionStatus: ConnectionStatus

// Close connection
wsClient.close(): void

// Force reset connection
wsClient.forceResetConnection(): void
```

### Message Handling

```typescript
// Send any message
await wsClient.send(message: OutgoingMessage): Promise<boolean>

// Example messages
await wsClient.send({
  message_type: OutgoingMessageType.JOIN,
  outpost_uuid: "outpost-id"
});

await wsClient.send({
  message_type: OutgoingMessageType.LIKE,
  outpost_uuid: "outpost-id",
  data: { react_to_user_address: "user-address" }
});
```

### Outpost Joining

```typescript
// Join outpost (single attempt)
await wsClient.asyncJoinOutpost(outpostId: string, force?: boolean): Promise<boolean>

// Join outpost with retry (recommended)
await wsClient.asyncJoinOutpostWithRetry(outpostId: string): Promise<boolean>
```

## Message Types

### Incoming Messages

- `USER_JOINED` / `USER_LEFT` - User presence updates
- `USER_LIKED` / `USER_DISLIKED` / `USER_BOOED` / `USER_CHEERED` - User reactions
- `USER_STARTED_SPEAKING` / `USER_STOPPED_SPEAKING` - Speaking state changes
- `USER_STARTED_RECORDING` / `USER_STOPPED_RECORDING` - Recording state changes
- `REMAINING_TIME_UPDATED` - Time remaining updates
- `TIME_IS_UP` - Time expiration notifications
- `USER_INVITED` / `USER_FOLLOWED` - Social notifications
- `WAITLIST_UPDATED` - Waitlist changes
- `CREATOR_JOINED` - Creator presence updates

### Outgoing Messages

- `JOIN` / `LEAVE` - Outpost membership
- `LIKE` / `DISLIKED` / `BOO` / `CHEER` - User reactions
- `START_SPEAKING` / `STOP_SPEAKING` - Speaking control
- `START_RECORDING` / `STOP_RECORDING` - Recording control
- `WAIT_FOR_CREATOR` - Creator waiting

## Redux Integration

The client automatically dispatches actions to your Redux store:

```typescript
// Automatically handled
onGoingOutpostActions.updateRemainingTime();
onGoingOutpostActions.updateUserIsTalking();
onGoingOutpostActions.incomingUserReaction();
onGoingOutpostActions.handleTimeIsUp();
onGoingOutpostActions.getLiveMembers();
onGoingOutpostActions.setCreatorJoined();
onGoingOutpostActions.setIsRecording();
notificationsActions.getNotifications();
globalActions.setWsConnectionStatus();
```

## Error Handling

The client provides comprehensive error handling:

### Automatic Reconnection

- Exponential backoff with jitter
- Configurable retry limits (default: 10 attempts)
- Automatic connection recovery

### User Notifications

- Toast notifications for connection issues
- Reload button for critical failures
- Silent handling of transient errors

### Development Logging

- Clean, prefixed console logs
- Error details and stack traces
- Connection state changes

## Configuration Options

```typescript
// Internal configuration (modify in client.ts)
private maxReconnectAttempts = 10;        // Max reconnection attempts
private reconnectDelay = 1000;            // Initial delay (1 second)
private maxReconnectDelay = 30000;        // Max delay (30 seconds)
private readonly pingInterval = 30000;    // Keep-alive interval
private readonly joinTimeout = 10000;     // Join request timeout
```

## Architecture

The simplified architecture consists of:

1. **WebSocketService**: Main singleton class handling all WebSocket operations
2. **Built-in Message Router**: Integrated message handling and Redux dispatch
3. **Connection Management**: Automatic reconnection with exponential backoff
4. **Join Request Manager**: Timeout-based outpost joining with retry logic
5. **Error Handling**: User-friendly error notifications and recovery

## Migration from Complex Architecture

If migrating from the previous multi-class architecture:

```typescript
// Old way (multiple classes)
connectionManager.connect(...)
joinRequestManager.joinOutpost(...)
messageRouter.routeMessage(...)

// New way (single class)
wsClient.connect(...)
wsClient.asyncJoinOutpost(...)
// Message routing handled automatically
```

## Development

### Debugging

- Set environment to development for detailed logging
- All logs are prefixed with `[WebSocket]`
- Connection state changes are clearly logged

### Testing

- Use `wsClient.forceResetConnection()` to simulate connection issues
- Monitor `wsClient.connectionStatus` for state verification
- Check Redux DevTools for automatic action dispatching

## Best Practices

1. **Always use retry methods** for joining outposts
2. **Check connection status** before critical operations
3. **Handle connection errors gracefully** in your UI
4. **Use the singleton instance** (`wsClient`) rather than creating new instances
5. **Monitor Redux state** for real-time updates

## Performance

- Automatic connection pooling (singleton pattern)
- Efficient message routing without intermediate objects
- Minimal memory footprint with integrated architecture
- Optimized reconnection strategy with exponential backoff
