import type { JSX } from "react";
import { KioskScreen } from "./kiosk/KioskScreen";
import { DaimonsScreen } from "./ui/daimon/DaimonsScreen";
import { RoomScreen2 } from "./ui/room2/RoomScreen2";

export const SCREENS: Record<string, JSX.Element> = {
  kiosk: <KioskScreen />,
  room: <RoomScreen2 />,
  daimon: <DaimonsScreen />,
};
