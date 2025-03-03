import type { JSX } from "react";
import { KioskScreen } from "./kiosk/KioskScreen";
import { DaimonsScreen } from "./ui/daimon/DaimonsScreen";
import { RoomScreen } from "./ui/room/RoomScreen";

export const SCREENS: Record<string, JSX.Element> = {
  kiosk: <KioskScreen />,
  room: <RoomScreen />,
  daimon: <DaimonsScreen />,
};
