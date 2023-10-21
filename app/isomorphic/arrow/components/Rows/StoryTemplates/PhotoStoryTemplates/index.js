/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
/* eslint-disable max-len */
import { SocialShare } from "@quintype/components";
import PropTypes from "prop-types";
import React from "react";
import get from "lodash/get";
import { useSelector } from "react-redux";
import kebabCase from "lodash/kebabCase";
import { AuthorCard } from "../../../Atoms/AuthorCard";
import { CaptionAttribution } from "../../../Atoms/CaptionAttribution";
import { SocialShareTemplate } from "../../../Molecules/SocialShareTemplate";
import { SectionTag } from "../../../Atoms/SectionTag";
import { StoryHeadline } from "../../../Atoms/StoryHeadline";
import { Subheadline } from "../../../Atoms/Subheadline";
import { HeroImage } from "../../../Atoms/HeroImage";
import { PublishDetails } from "../../../Atoms/PublishDetail";
import { StoryTags } from "../../../Atoms/StoryTags";
import { PhotoStoryElement, SlotAfterStory } from "../../../Molecules/StoryElementCard";
import { StateProvider } from "../../../SharedContext";
import AsideCollection from "../../AsideCollection";
import { MetypeCommentsWidget } from "../../../../../components/Metype/commenting-widget";
import { MetypeReactionsWidget } from "../../../../../components/Metype/reaction-widget";
import "./photo.m.css";
import { Paywall } from "../../Paywall";

const StoryTemplatePhoto = ({
  story = {},
  config = {},
  storyElementsConfig,
  widgetComp,
  adComponent,
  firstChild,
  secondChild,
  hasAccess,
}) => {
  const {
    theme = "",
    asideCollection = {},
    templateType = "default",
    noOfVisibleCards = -1,
    publishedDetails = {},
    verticalShare = "",
    shareIconType = "plain-color-svg",
    authorDetails = {
      template: "default",
    },
    imageRender = "fullBleed",
    premiumStoryIconConfig = {},
  } = config;

  const metypeConfig = useSelector((state) => get(state, ["qt", "config", "publisher-attributes", "metypeConfig"], {}));
  const isMetypeEnabled = useSelector((state) =>
    get(state, ["qt", "config", "publisher-attributes", "enableMetype"], true)
  );
  const jwtToken = useSelector((state) => get(state, ["userReducer", "jwt_token"], null));

  const visibledCards = noOfVisibleCards < 0 ? story.cards : story.cards.slice(0, noOfVisibleCards);
  const storyId = get(story, ["id"], "");
  const timezone = useSelector((state) => get(state, ["qt", "data", "timezone"], null));

  const HeaderCard = () => {
    return (
      <div styleName="grid-col-2-10 header-details">
        <SectionTag story={story} />
        <StoryHeadline story={story} premiumStoryIconConfig={premiumStoryIconConfig} />
        <Subheadline story={story} showFullContent />
      </div>
    );
  };

  const SocialShareComponent = () => {
    return (
      <div id={`story-share-${storyId}`} className="content-style">
        <SocialShare
          template={SocialShareTemplate}
          fullUrl={encodeURI(story.url)}
          title={story.headline}
          theme={theme}
          vertical={!!verticalShare}
          iconType={shareIconType}
          shareIconId={`share-icon-story-share-${storyId}`}
        />
      </div>
    );
  };

  const StoryData = ({ hasAccess }) => {
    const isStoryBehindPaywall = story.access === "subscription" && hasAccess === false;

    return (
      <>
        {authorDetails && (
          <AuthorCard clazzName="gap-32" story={story} template={authorDetails.template} opts={authorDetails.opts} />
        )}
        <div styleName="story-details">
          <PublishDetails story={story} opts={publishedDetails} template="story" timezone={timezone} />
          {!verticalShare && <SocialShareComponent />}
        </div>
        {isStoryBehindPaywall ? (
          <>
            <PhotoStoryElement
              story={story}
              card={visibledCards[0]}
              key={get(visibledCards[0], ["id"], "")}
              config={{ ...storyElementsConfig, theme }}
              adComponent={adComponent}
              widgetComp={widgetComp}
            />
            <Paywall />
          </>
        ) : (
          visibledCards.map((card) => {
            return (
              <PhotoStoryElement
                story={story}
                card={card}
                key={get(card, ["id"], "")}
                config={{ ...storyElementsConfig, theme }}
                adComponent={adComponent}
                widgetComp={widgetComp}
              />
            );
          })
        )}
        <div styleName="space-32">
          {firstChild}
          <StoryTags tags={story.tags} />
          <SlotAfterStory
            id={story.id}
            element={story.customSlotAfterStory}
            AdComponent={adComponent}
            WidgetComp={widgetComp}
          />
          {secondChild}
        </div>
      </>
    );
  };

  const renderImages = (imageRender) => {
    switch (imageRender) {
      case "fullBleed":
        return "grid-col-full";
      case "container":
        return "grid-container";
      default:
        return "grid-col-full";
    }
  };

  const defaultTemplate = ({ story, config, hasAccess }) => {
    return (
      <>
        <div data-test-id="hero-image" styleName={`${renderImages(imageRender)} index-2`}>
          <HeroImage
            story={story}
            aspectRatio={[
              [16, 9],
              [8, 3],
            ]}
            defaultFallback={false}
            isStoryPageImage
          />
        </div>
        <div styleName="grid-col-2-10 space-12">
          <CaptionAttribution story={story} config={config} />
          <HeaderCard />
          <StoryData hasAccess={hasAccess} />
          {isMetypeEnabled && (
            <>
              <MetypeCommentsWidget
                host={metypeConfig.metypeHost}
                accountId={metypeConfig.metypeAccountId}
                pageURL={story.url}
                primaryColor={metypeConfig.primaryColor}
                className={metypeConfig.className}
                jwt={jwtToken}
                fontUrl={metypeConfig.fontFamilyUrl}
                fontFamily={metypeConfig.fontFamily}
                storyId={story.id}
              />
              <MetypeReactionsWidget
                host={metypeConfig.metypeHost}
                accountId={metypeConfig.metypeAccountId}
                storyUrl={story.url}
                storyId={story.id}
              />
            </>
          )}
        </div>
        {verticalShare && <SocialShareComponent />}
        {asideCollection && (
          <div styleName="grid-col-10-14 space-12">
            <AsideCollection
              {...asideCollection}
              widgetComp={widgetComp}
              adComponent={adComponent}
              sticky={true}
              storyId={storyId}
              opts={publishedDetails}
            />
          </div>
        )}
      </>
    );
  };

  const heroPriority = ({ story, config, hasAccess }) => {
    return (
      <>
        <div data-test-id="hero-image" styleName={`${renderImages(imageRender)} index-2`}>
          <HeroImage story={story} aspectRatio={[[16, 9]]} defaultFallback={false} isStoryPageImage />
        </div>
        <div styleName="grid-col-4-12 space-12">
          <CaptionAttribution story={story} config={config} />
          <HeaderCard />
          <StoryData hasAccess={hasAccess} />
          {isMetypeEnabled && (
            <>
              <MetypeReactionsWidget
                host={metypeConfig.metypeHost}
                accountId={metypeConfig.metypeAccountId}
                storyUrl={story.url}
                storyId={story.id}
              />
              <MetypeCommentsWidget
                host={metypeConfig.metypeHost}
                accountId={metypeConfig.metypeAccountId}
                pageURL={story.url}
                primaryColor={metypeConfig.primaryColor}
                className={metypeConfig.className}
                jwt={jwtToken}
                fontUrl={metypeConfig.fontFamilyUrl}
                fontFamily={metypeConfig.fontFamily}
                storyId={story.id}
              />
            </>
          )}
        </div>
        {verticalShare && <SocialShareComponent />}
        {asideCollection && (
          <div styleName="grid-container space-12 tablet-index-2">
            <AsideCollection
              horizontal={true}
              {...asideCollection}
              widgetComp={widgetComp}
              adComponent={adComponent}
              storyId={storyId}
              opts={publishedDetails}
            />
          </div>
        )}
      </>
    );
  };

  const headlinePriority = ({ story, config, hasAccess }) => {
    return (
      <>
        <div styleName="grid-container side-space">
          <HeaderCard />
        </div>
        <div styleName="grid-col-2-9 side-space index-2">
          <HeroImage story={story} aspectRatio={[[16, 9]]} defaultFallback={false} isStoryPageImage />
        </div>
        <div styleName="grid-col-2-9 side-space">
          <CaptionAttribution story={story} config={config} />
          <StoryData hasAccess={hasAccess} />
          {isMetypeEnabled && (
            <>
              <MetypeReactionsWidget
                host={metypeConfig.metypeHost}
                accountId={metypeConfig.metypeAccountId}
                storyUrl={story.url}
                storyId={story.id}
              />
              <MetypeCommentsWidget
                host={metypeConfig.metypeHost}
                accountId={metypeConfig.metypeAccountId}
                pageURL={story.url}
                primaryColor={metypeConfig.primaryColor}
                className={metypeConfig.className}
                jwt={jwtToken}
                fontUrl={metypeConfig.fontFamilyUrl}
                fontFamily={metypeConfig.fontFamily}
                storyId={story.id}
              />
            </>
          )}
        </div>
        {verticalShare && <SocialShareComponent />}
        {asideCollection && (
          <div styleName="grid-col-9-14">
            <AsideCollection
              {...asideCollection}
              widgetComp={widgetComp}
              adComponent={adComponent}
              sticky={true}
              storyId={storyId}
              opts={publishedDetails}
            />
          </div>
        )}
      </>
    );
  };

  const getStoryTemplate = (templateType, { story, config }, hasAccess) => {
    switch (templateType) {
      case "hero-priority-center":
        return heroPriority({ story, config, hasAccess });
      case "headline-priority":
        return headlinePriority({ story, config, hasAccess });
      default:
        return defaultTemplate({ story, config, hasAccess });
    }
  };
  return <>{getStoryTemplate(templateType, { story, config }, hasAccess)}</>;
};

StoryTemplatePhoto.propTypes = {
  story: PropTypes.object,
  config: PropTypes.shape({
    templateType: PropTypes.string,
    asideCollection: PropTypes.object,
  }),
  firstChild: PropTypes.node,
  secondChild: PropTypes.node,
  storyElementsConfig: PropTypes.object,
  adComponent: PropTypes.func,
  widgetComp: PropTypes.func,
  hasAccess: PropTypes.func,
};

const PhotoStoryTemplate = ({
  story = {},
  config = {},
  storyElementsConfig,
  widgetComp,
  adComponent,
  firstChild,
  secondChild,
}) => {
  const {
    theme = "",
    templateType = "default",
    verticalShare = "",

    imageRender = "fullBleed",
  } = config;

  const isFullBleed = imageRender === "fullBleed";

  const timezone = useSelector((state) => get(state, ["qt", "data", "timezone"], null));
  return (
    <div
      styleName={`${verticalShare} ${isFullBleed ? "fullBleed" : ""}`}
      data-test-id={`photo-story-${templateType}-${kebabCase(imageRender)}`}
      className={`arrow-component arr-story-grid arr--content-wrapper arr--photo-story-template-wrapper ${templateType} `}
      style={{ backgroundColor: theme }}
    >
      <StoryTemplatePhoto
        story={story}
        config={config}
        templateType={templateType}
        adComponent={adComponent}
        widgetComp={widgetComp}
        firstChild={firstChild}
        secondChild={secondChild}
        timezone={timezone}
        storyElementsConfig={storyElementsConfig}
      />
    </div>
  );
};
PhotoStoryTemplate.propTypes = {
  story: PropTypes.object,
  config: PropTypes.shape({
    templateType: PropTypes.string,
    asideCollection: PropTypes.object,
  }),
  firstChild: PropTypes.node,
  secondChild: PropTypes.node,
  storyElementsConfig: PropTypes.object,
  adComponent: PropTypes.func,
  widgetComp: PropTypes.func,
};

export default StateProvider(PhotoStoryTemplate, StoryTemplatePhoto);
