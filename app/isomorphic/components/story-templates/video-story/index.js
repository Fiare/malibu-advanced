import React from "react";
import VideoStoryTemplate from "../../../arrow/components/Rows/StoryTemplates/VideoStoryTemplates";
import { object, func } from "prop-types";

const VideoStory = ({ story, config, adWidget, adPlaceholder, hasAccess }) => {
  const templateSpecific = { templateType: "headline-priority" };

  return (
    <VideoStoryTemplate
      story={story}
      config={{ ...config, ...templateSpecific }}
      adComponent={adWidget}
      widgetComp={adWidget}
      firstChild={adPlaceholder}
      secondChild={adPlaceholder}
      hasAccess={hasAccess}
    />
  );
};

VideoStory.propTypes = {
  story: object,
  config: object,
  adWidget: func,
  adPlaceholder: object,
  hasAccess: func,
};

export default VideoStory;
