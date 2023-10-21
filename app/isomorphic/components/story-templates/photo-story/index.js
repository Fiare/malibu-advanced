import React from "react";
import PhotoStoryTemplate from "../../../arrow/components/Rows/StoryTemplates/PhotoStoryTemplates";
import { object, func } from "prop-types";

const PhotoStory = ({ story, config, adWidget, adPlaceholder, hasAccess }) => {
  const templateSpecific = {
    templateType: "hero-priority-center",
    showSection: false,
  };
  return (
    <PhotoStoryTemplate
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

PhotoStory.propTypes = {
  story: object,
  config: object,
  adWidget: func,
  adPlaceholder: object,
  hasAccess: func,
};

export default PhotoStory;
