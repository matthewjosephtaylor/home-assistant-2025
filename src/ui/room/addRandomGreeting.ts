import { Asserts } from "@mjt-engine/assert";
import { isDefined, isUndefined } from "@mjt-engine/object";
import { Daimons } from "@mjt-services/daimon-common-2025";
import { getConnection } from "../../connection/Connections";
import { useAppState } from "../../state/AppState";
import { putContent } from "../common/putContent";
import { putRoom } from "../common/putRoom";
import { linkDaimonToRoom } from "./linkDaimonToRoom";

export const addRandomGreeting = async (activeRoomId?: string) => {
  if (!isDefined(activeRoomId)) {
    console.error("Room ID is not defined for adding random greeting");
    return;
  }
  const con = await getConnection();

  // console.log("out", out);
  // const activeRoomParentId = treeApi.getActiveNoteParentId();
  // const activeRoomId = useAppState.getState().activeRoomId;
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
  const userDaimon = daimons.find((d) => d.chara.data.extensions?.isUser);
  if (!userDaimon) {
    console.error("No user daimon found for text entry");
    return;
  }
  const nonUserDaimons = daimons.filter((d) => d.id !== userDaimon.id);

  const greeterDaimon =
    nonUserDaimons[Math.floor(Math.random() * nonUserDaimons.length)];

  if (!greeterDaimon) {
    console.error("No daimon available for text entry");
    return;
  }
  console.log("daimon", greeterDaimon);
  const greetings = [
    greeterDaimon.chara.data.first_mes,
    ...(greeterDaimon.chara.data.alternate_greetings ?? []),
  ].filter(isDefined);
  const randomGreeting =
    greetings[Math.floor(Math.random() * greetings.length)];
  if (!randomGreeting) {
    console.error("No greeting available for text entry");
    return;
  }
  const vars = {
    chara: greeterDaimon.chara.data.name ?? "Assistant",
    user: userDaimon.chara.data.name ?? "User",
  };
  const renderedGreeting = Asserts.assertValue(
    Daimons.renderTemplate(randomGreeting, vars)
  );
  console.log("renderedGreeting", renderedGreeting);
  const contentId = await putContent({
    contentType: "text/plain",
    value: renderedGreeting,
    creatorId: greeterDaimon.id,
    createdAt: Date.now(),
    finalized: true,
  });
  const {} = await putRoom({
    contentId: contentId,
    parentId: useAppState.getState().activeRoomId,
  });
};
