export type NotificationType =
  | "info"
  | "success"
  | "warning"
  | "error"
  | "request";
export type NotificationCategory = "system" | "car" | "user" | "request";

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  link?: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  uniqueId?: string;
}
