import type { JSX } from "react";
import { DaimonsScreen } from "./ui/daimon/DaimonsScreen";
import { RoomScreen } from "./ui/room/RoomScreen";
import { DaimonCreationScreen } from "./ui/daimon-creation/DaimonCreationScreen";
import { LorebooksScreen } from "./ui/lore/LorebooksScreen";

export const SCREENS = {
  // kiosk: <KioskScreen />,
  room: <RoomScreen />,
  daimon: <DaimonsScreen />,
  lore: <LorebooksScreen />,
  daimon_creation: <DaimonCreationScreen />,
} satisfies Record<string, JSX.Element>;
