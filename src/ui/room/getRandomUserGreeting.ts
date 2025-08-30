import { isDefined, isUndefined } from "@mjt-engine/object";
import { Daimons } from "@mjt-services/daimon-common-2025";
import { getConnection } from "../../connection/Connections";
import { useAppState } from "../../state/AppState";
import { linkDaimonToRoom } from "./linkDaimonToRoom";


export const getRandomUserGreeting = async (activeRoomId?: string) => {
  if (!isDefined(activeRoomId)) {
    console.error("Room ID is not defined for adding random greeting");
    return;
  }
  const con = await getConnection();

  if (isUndefined(activeRoomId)) {
    return;
  }
  const { userDaimonId } = useAppState.getState();
  if (isDefined(userDaimonId)) {
    await linkDaimonToRoom({
      daimonId: userDaimonId,
      roomId: activeRoomId,
    });
  }
  // const userDaimon = await Daimons.getUserDaimon(con);
  const daimons = (await Daimons.findDaimonsByRoom(con)(activeRoomId)).toSorted(
    (a, b) => {
      if (a.chara.data.name && b.chara.data.name) {
        return a.chara.data.name.localeCompare(b.chara.data.name);
      }
      return 0;
    }
  );
  console.log("daimons", daimons);
  const greeterDaimon = daimons.find((d) => d.chara.data.extensions?.isUser);
  if (!greeterDaimon) {
    console.error("No user daimon found for text entry");
    return;
  }

  if (!greeterDaimon) {
    console.error("No daimon available for text entry");
    return;
  }
  console.log("daimon", greeterDaimon);
  const greetings = [
    greeterDaimon.chara.data.first_mes,
    ...(greeterDaimon.chara.data.alternate_greetings ?? []),
  ].filter(isDefined);
  const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
  return randomGreeting;
};
