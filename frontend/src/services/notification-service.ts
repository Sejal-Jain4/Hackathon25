// This service manages user notifications in the app

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  isRead: boolean;
  actionRoute?: string;
  actionParams?: Record<string, any>;
}

export type NotificationType = 
  | 'goal' 
  | 'budget' 
  | 'achievement' 
  | 'tip' 
  | 'warning' 
  | 'transaction' 
  | 'system';

// Sample notifications
const sampleNotifications: Notification[] = [
  {
    id: '1',
    title: 'Budget Alert',
    message: 'You have reached 80% of your Entertainment budget for this month.',
    type: 'warning',
    timestamp: new Date(2024, 4, 12), // May 12, 2024
    isRead: false,
    actionRoute: 'Budget',
    actionParams: { budgetId: '2' },
  },
  {
    id: '2',
    title: 'Achievement Unlocked',
    message: 'You earned the "Budget Boss" badge for staying under budget!',
    type: 'achievement',
    timestamp: new Date(2024, 4, 10), // May 10, 2024
    isRead: true,
    actionRoute: 'Profile',
    actionParams: { tab: 'achievements' },
  },
  {
    id: '3',
    title: 'Goal Reminder',
    message: 'Your "Summer Trip" goal deadline is approaching in 2 weeks.',
    type: 'goal',
    timestamp: new Date(2024, 4, 8), // May 8, 2024
    isRead: false,
    actionRoute: 'Goals',
    actionParams: { goalId: '2' },
  },
  {
    id: '4',
    title: 'Money Tip',
    message: 'Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings.',
    type: 'tip',
    timestamp: new Date(2024, 4, 5), // May 5, 2024
    isRead: true,
  },
];

export const NotificationService = {
  // Get all notifications
  getNotifications: async (): Promise<Notification[]> => {
    // In a real app, this would fetch from the backend
    return sampleNotifications;
  },

  // Get unread notifications count
  getUnreadCount: async (): Promise<number> => {
    return sampleNotifications.filter(notification => !notification.isRead).length;
  },

  // Mark a notification as read
  markAsRead: async (id: string): Promise<void> => {
    const notification = sampleNotifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (): Promise<void> => {
    sampleNotifications.forEach(notification => {
      notification.isRead = true;
    });
  },

  // Delete a notification
  deleteNotification: async (id: string): Promise<void> => {
    const index = sampleNotifications.findIndex(n => n.id === id);
    if (index !== -1) {
      sampleNotifications.splice(index, 1);
    }
  },

  // Add a new notification
  addNotification: async (
    notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>
  ): Promise<Notification> => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      isRead: false,
    };
    
    sampleNotifications.unshift(newNotification); // Add to the beginning of the array
    return newNotification;
  },

  // Add a budget warning notification
  addBudgetWarning: async (budgetId: string, budgetName: string, percentage: number): Promise<Notification> => {
    return NotificationService.addNotification({
      title: 'Budget Alert',
      message: `You have reached ${percentage}% of your ${budgetName} budget.`,
      type: 'warning',
      actionRoute: 'Budget',
      actionParams: { budgetId },
    });
  },

  // Add a goal deadline reminder notification
  addGoalReminder: async (goalId: string, goalName: string, daysLeft: number): Promise<Notification> => {
    return NotificationService.addNotification({
      title: 'Goal Reminder',
      message: `Your "${goalName}" goal deadline is approaching in ${daysLeft} days.`,
      type: 'goal',
      actionRoute: 'Goals',
      actionParams: { goalId },
    });
  },

  // Add an achievement notification
  addAchievementNotification: async (badgeName: string): Promise<Notification> => {
    return NotificationService.addNotification({
      title: 'Achievement Unlocked',
      message: `You earned the "${badgeName}" badge!`,
      type: 'achievement',
      actionRoute: 'Profile',
      actionParams: { tab: 'achievements' },
    });
  },

  // Get notifications by type
  getNotificationsByType: async (type: NotificationType): Promise<Notification[]> => {
    return sampleNotifications.filter(notification => notification.isRead);
  },
  
  // Schedule local notification (would use Expo Notifications in a real app)
  scheduleLocalNotification: async (
    title: string,
    message: string,
    scheduledTime: Date
  ): Promise<string> => {
    // In a real app, this would use Expo Notifications
    console.log(`Scheduled notification: ${title} for ${scheduledTime.toISOString()}`);
    return Math.random().toString(36).substr(2, 9); // Return mock notification ID
  }
};