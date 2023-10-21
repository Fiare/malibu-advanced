import React, { useEffect, useState } from "react";
import { scriptLoader } from "../index";

const MetypeReactionsWidget = (props) => {
  // eslint-disable-next-line react/prop-types
  const { accountId, host, storyUrl, storyId, fontUrl, fontFamily } = props;
  const [triggerInitPageReactions, setTriggerInitPageReactions] = useState(false);
  const reactionWrapper =
    typeof document !== "undefined" && document.getElementById(`metype-page-reactions-container-${storyId}`);

  useEffect(() => {
    !window.talktype && scriptLoader(host, () => initPageReactions(storyId));

    if (triggerInitPageReactions) {
      initPageReactions(storyId);
    }
  }, [triggerInitPageReactions]);

  if (reactionWrapper && !triggerInitPageReactions) {
    setTriggerInitPageReactions(true);
  }

  const initPageReactions = () => {
    if (window.talktype && reactionWrapper) {
      window.talktype.pageReactionsIframe(reactionWrapper);
    }
  };

  return (
    <div
      style={{ marginTop: "20px" }}
      id={`metype-page-reactions-container-${storyId}`}
      data-metype-account-id={accountId}
      data-metype-host={host}
      data-metype-page-url={storyUrl}
      data-metype-font-url={fontUrl || ""}
      data-metype-font-family={fontFamily || ""}
    ></div>
  );
};

export { MetypeReactionsWidget };
