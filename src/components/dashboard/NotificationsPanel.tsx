import React from 'react';
import Card from '../common/Card';

/**
 * NotificationsPanel props
 */
type Notification = {
  id: number;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
};
type NotificationsPanelProps = {
  notifications: Notification[];
};

/**
 * NotificationsPanel: list of notifications
 */
const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications }) => {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold mb-2">Notifications</h2>
      {notifications.length === 0 ? (
        <div className="text-neutral-400">No notifications.</div>
      ) : (
        <ul className="flex flex-col gap-2">
          {notifications.map((n) => (
            <li key={n.id} className={`text-sm notification-${n.type}`}>
              <span className="font-semibold mr-2">[{n.type}]</span>
              {n.message}
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
};

export default NotificationsPanel; 