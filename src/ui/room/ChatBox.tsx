// import styles from "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import "./room-screen.scss";

import {
  ChatContainer,
  MainContainer,
  MessageInput,
  MessageList,
} from "@chatscope/chat-ui-kit-react";
import {
  DAIMON_OBJECT_STORE,
  type Daimon,
} from "@mjt-services/daimon-common-2025";
import {
  Datas,
  Ids,
  LINK_OBJECT_STORE,
  type Link,
} from "@mjt-services/data-common-2025";
import type { ChatAstSpec } from "../../chatlang/ChatAstSpec";
import type { ChatEvaluator } from "../../chatlang/ChatEvaluator";
import { ChatLangs } from "../../chatlang/ChatLangs";
import { getConnection } from "../../connection/Connections";
import type { TreeApi } from "../common/tree/TreeApi";

export const nameToDaimons = async (name: string) => {
  const query = `values(@) | [?contains(chara.data.name, '${name}')]`;
  // const query = `values(@) | [?contains(data.name, '${name}')]`;
  return Datas.search(await getConnection())({
    from: DAIMON_OBJECT_STORE,
    query: query,
  }) as unknown as Daimon[];
};

export type RoomDaimonLink = Link<{
  roomId: string;
  daimonId: string;
}>;

export const linkDaimonToRoom = async ({
  daimonId,
  roomId,
}: {
  daimonId: string;
  roomId: string;
}) => {
  const existingLinks = (await Datas.search(await getConnection())({
    from: LINK_OBJECT_STORE,
    query: `values(@) | [?roomId == '${roomId}' && daimonId == '${daimonId}']`,
  })) as RoomDaimonLink[];
  console.log("existingLinks", existingLinks);
  if (existingLinks.length > 0) {
    return existingLinks[0];
  }
  const link: RoomDaimonLink = {
    id: Ids.fromObjectStore(LINK_OBJECT_STORE),
    roomId,
    daimonId,
  };
  await Datas.put(await getConnection())({
    value: link,
  });
  return link;
};

export const TextEntryEvaluator = (treeApi: TreeApi) =>
  ({
    handleMention: async function (
      node: ChatAstSpec["Mention"]
    ): Promise<string> {
      const daimons = await nameToDaimons(node.value);
      console.log("daimons", daimons);
      const roomId = treeApi.getActiveNoteParentId();
      console.log("room", roomId);
      if (daimons.length === 1 && roomId) {
        const link = await linkDaimonToRoom({
          daimonId: daimons[0].id,
          roomId: roomId,
        });
        console.log("link", link);
        // return daimons[0].data.name;
      }
      return node.value;
    },
    handleCommand: function (node: ChatAstSpec["Command"]): string {
      return "";
    },
    handleText: function (node: ChatAstSpec["Text"]): string {
      return node.value;
    },
  }) as ChatEvaluator;
export const ChatBox = ({ treeApi }: { treeApi: TreeApi }) => {
  return (
    <MainContainer className="dark">
      <ChatContainer>
        <MessageList>
          <MessageList />
        </MessageList>
        <MessageInput
          placeholder="Type message here"
          onSend={async (innerHtml, textContent, innerText) => {
            const out = await ChatLangs.interpretText(
              textContent,
              TextEntryEvaluator(treeApi)
            );
            console.log("out", out);
          }}
        />
      </ChatContainer>
    </MainContainer>
  );
};
