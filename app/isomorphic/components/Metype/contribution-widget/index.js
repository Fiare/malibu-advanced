import React, { useEffect } from "react";
import { scriptLoader } from "../index.js";
import { string, number } from "prop-types";

export const MetypeContributionWidget = ({ host, accountId, publisher, fontFamily, fontUrl }) => {
  const randomNumber = new Date().getMilliseconds();

  useEffect(() => {
    !window.talktype && scriptLoader(host, () => initWidget(randomNumber));
    initWidget(randomNumber);
  }, []);

  const initWidget = (randomNumber) => {
    if (window.talktype) {
      window.talktype.contributionWidgetIframe(document.getElementById(`metype-contribution-${randomNumber}`));
    }
  };

  return (
    <div>
      <div
        id={`metype-contribution-${randomNumber}`}
        data-metype-account-id={accountId}
        data-metype-host={host}
        data-metype-publisher={publisher}
        data-metype-font-url={fontUrl || ""}
        data-metype-font-family={fontFamily || ""}
      ></div>
    </div>
  );
};

MetypeContributionWidget.propTypes = {
  host: string,
  accountId: number,
  publisher: string,
  fontFamily: string,
  fontUrl: string,
};
