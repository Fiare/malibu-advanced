import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import kebabCase from "lodash/kebabCase";
import { StateProvider } from "../../../SharedContext";
import { StoryTemplate } from "./templates";
import get from "lodash/get";
import "./text-story.m.css";

const TextStoryTemplate = ({
  story = {},
  config = {},
  storyElementsConfig,
  adComponent,
  widgetComp,
  firstChild,
  secondChild,
  hasAccess,
}) => {
  const {
    theme = "",
    templateType = "default",
    imageRender = "fullBleed",
    sort = "headline-first",
    verticalShare = "",
  } = config;
  const sortOption = templateType === "hero-vertical-priority" ? sort : "";

  const supportImageType = {
    default: imageRender,
    "hero-priority-center": imageRender,
    "headline-hero-priority": imageRender,
    "hero-vertical-priority": imageRender,
  };

  const timezone = useSelector((state) => get(state, ["qt", "data", "timezone"], null));

  const dataTestId = supportImageType[templateType]
    ? `text-story-${templateType}-${kebabCase(supportImageType[templateType])}`
    : `text-story-${templateType}`;

  return (
    <div
      data-test-id={dataTestId}
      className="arrow-component arr-story-grid arr--content-wrapper arr--text-story-template-wrapper"
      styleName={`${templateType} ${verticalShare} ${supportImageType[templateType] || ""} ${sortOption}`}
      style={{ backgroundColor: theme }}
    >
      <StoryTemplate
        story={story}
        config={config}
        storyElementsConfig={storyElementsConfig}
        adComponent={adComponent}
        widgetComp={widgetComp}
        firstChild={firstChild}
        secondChild={secondChild}
        timezone={timezone}
        storyAccess={story.access}
        hasAccess={hasAccess}
      />
    </div>
  );
};

TextStoryTemplate.propTypes = {
  story: PropTypes.object,
  config: PropTypes.shape({
    templateType: PropTypes.string,
    authorCard: PropTypes.object,
    asideCollection: PropTypes.object,
  }),
  firstChild: PropTypes.node,
  secondChild: PropTypes.node,
  storyElementsConfig: PropTypes.object,
  adComponent: PropTypes.func,
  widgetComp: PropTypes.func,
  hasAccess: PropTypes.bool,
};

export default StateProvider(TextStoryTemplate);
