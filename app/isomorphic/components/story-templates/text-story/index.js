import React from "react";
import TextStoryTemplate from "../../../arrow/components/Rows/StoryTemplates/TextStoryTemplates";
import { object, func, bool } from "prop-types";

const TextStory = ({ story, config, adWidget, adPlaceholder, hasAccess }) => {
  const templateSpecific = {};
  return (
    <TextStoryTemplate
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

TextStory.propTypes = {
  story: object,
  config: object,
  adWidget: func,
  adPlaceholder: object,
  hasAccess: bool,
};

export default TextStory;
