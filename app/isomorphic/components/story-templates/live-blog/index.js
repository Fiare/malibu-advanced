import React from "react";
import LiveBlogStoryTemplate from "../../../arrow/components/Rows/StoryTemplates/LiveBlogStoryTemplates";
import { object, func } from "prop-types";

const LiveBlogStory = ({ story, config, adWidget, adPlaceholder, hasAccess }) => {
  const templateSpecific = { templateType: "hero-overlay", showSection: false };

  return (
    <LiveBlogStoryTemplate
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

LiveBlogStory.propTypes = {
  story: object,
  config: object,
  adWidget: func,
  adPlaceholder: object,
  hasAccess: func,
};

export default LiveBlogStory;
