import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";

import { getTextColor, getTimeStamp, timestampToFormat } from "../../../utils/utils";
import { ReadTime } from "../ReadTime";

import "./publish-details.m.css";
import { useStateValue } from "../../SharedContext";
import { useSelector } from "react-redux";

export const PublishDetails = ({ story, opts = {}, template = "", timezone = null }) => {
  const [direction, setDirection] = useState("ltr");
  useEffect(() => {
    const htmlElement = document.getElementsByTagName("HTML");
    if (htmlElement && htmlElement.length > 0 && htmlElement[0].dir.toLocaleLowerCase() === "rtl") {
      setDirection("rtl");
    }
  }, []);

  const config = useStateValue() || {};
  const { "first-published-at": firstPublishAt, "last-published-at": lastPublish, "updated-at": updatedAt } = story;
  const { enableUpdatedTime, enablePublishedTime, showReadTime, localizedPublishedOn, localizedUpdatedOn } = opts;
  const time = lastPublish || firstPublishAt;
  const textColor = getTextColor(config.theme);
  const languageCode = useSelector((state) => get(state, ["qt", "config", "language", "ietf-code"], "en"));
  const timeStampProps =
    direction === "rtl"
      ? { ...opts, direction: direction, isTimeFirst: true, showTime: true }
      : { ...opts, direction: direction, showTime: true };

  return (
    <div data-test-id="timeStamp" className="arrow-component arr-publish-details" styleName={`timeStamp ${textColor}`}>
      <div data-test-id="publishDetails" styleName={`publish-details ${textColor}`}>
        {enablePublishedTime && time && (
          <>
            {localizedPublishedOn || "Published on"} :&nbsp;
            <div styleName="date">
              {getTimeStamp(time, timestampToFormat, timeStampProps, languageCode, template, timezone)}
            </div>
            {showReadTime && <ReadTime story={story} opts={opts} />}
          </>
        )}
      </div>
      {enableUpdatedTime && updatedAt && (
        <div data-test-id="updateDetails" styleName={`update-details ${textColor}`}>
          {localizedUpdatedOn || "Updated on"} :&nbsp;
          <div styleName="date">
            {getTimeStamp(updatedAt, timestampToFormat, timeStampProps, languageCode, template, timezone)}
          </div>
          {showReadTime && <ReadTime story={story} opts={opts} />}
        </div>
      )}
    </div>
  );
};

PublishDetails.propTypes = {
  /** The Story Object from the API response */
  story: PropTypes.shape({
    "first-published-at": PropTypes.number,
    "last-published-at": PropTypes.number,
    "read-time": PropTypes.number,
    "updated-at": PropTypes.number,
  }),
  timezone: PropTypes.string,
  template: PropTypes.string,
  opts: PropTypes.shape({
    showReadTime: PropTypes.bool,
    enableUpdatedTime: PropTypes.bool,
    enablePublishedTime: PropTypes.bool,
  }),
};
