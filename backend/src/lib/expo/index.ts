import { Expo } from "expo-server-sdk";

export const expo = new Expo();

export const isExpoPushToken = (token: string) => Expo.isExpoPushToken(token);
