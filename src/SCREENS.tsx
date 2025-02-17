import type { JSX } from "react";
import { KioskScreen } from "./kiosk/KioskScreen";
import { RoomScreen } from "./ui/room/RoomScreen";
import { DaimonsScreen } from "./ui/daimon/DaimonsScreen";

export const SCREENS: Record<string, JSX.Element> = {
  kiosk: <KioskScreen />,
  room: <RoomScreen />,
  daimon: <DaimonsScreen />,
};
