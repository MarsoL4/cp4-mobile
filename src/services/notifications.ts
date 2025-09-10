import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

export async function askNotificationPermission() {
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    return finalStatus === "granted";
  }
  return false;
}

export async function scheduleTaskNotification(title: string, date: Date) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Lembrete de tarefa",
      body: title,
    },
    trigger: { date, channelId: "default" },
  });
}