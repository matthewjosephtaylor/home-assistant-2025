import type { JSX } from "react";
import { DaimonsScreen } from "./ui/daimon/DaimonsScreen";
import { RoomScreen } from "./ui/room/RoomScreen";

export const SCREENS = {
  // kiosk: <KioskScreen />,
  room: <RoomScreen />,
  daimon: <DaimonsScreen />,
} satisfies Record<string, JSX.Element>;
