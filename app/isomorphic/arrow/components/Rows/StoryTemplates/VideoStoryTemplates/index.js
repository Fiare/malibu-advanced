/* eslint-disable react/no-unknown-property */
import { SocialShare } from "@quintype/components";
import PropTypes from "prop-types";
import React from "react";
import { useSelector } from "react-redux";
import get from "lodash/get";
import { SocialShareTemplate } from "../../../Molecules/SocialShareTemplate";
import { SectionTag } from "../../../Atoms/SectionTag";
import { StoryHeadline } from "../../../Atoms/StoryHeadline";
import { Subheadline } from "../../../Atoms/Subheadline";
import { Video } from "../../../Atoms/StoryElements/Video";
import AsideCollection from "../../AsideCollection";
import { AuthorCard } from "../../../Atoms/AuthorCard";
import { PublishDetails } from "../../../Atoms/PublishDetail";
import { StoryTags } from "../../../Atoms/StoryTags";
import { StoryElementCard, SlotAfterStory } from "../../../Molecules/StoryElementCard";
import { StateProvider } from "../../../SharedContext";
import { MetypeCommentsWidget } from "../../../../../components/Metype/commenting-widget";
import { MetypeReactionsWidget } from "../../../../../components/Metype/reaction-widget";
import "./video-story.m.css";
import { Paywall } from "../../Paywall";

const VideoStoryTemplate = ({
  story = {},
  config = {},
  storyElementsConfig,
  widgetComp,
  adComponent,
  firstChild,
  secondChild,
  hasAccess,
}) => {
  const heroVideo =
    story.cards
      .flatMap((card) => card["story-elements"])
      .find(
        ({ type, subtype }) => type === "youtube-video" || (type === "jsembed" && subtype === "dailymotion-video")
      ) || {};

  const {
    theme = "",
    authorCard = {},
    authorDetails = {
      template: "default",
    },
    asideCollection = {},
    templateType = "",
    noOfVisibleCards = -1,
    publishedDetails = {},
    verticalShare = "",
    shareIconType = "plain-color-svg",
    premiumStoryIconConfig = {},
  } = config;

  const visibledCards = noOfVisibleCards < 0 ? story.cards : story.cards.slice(0, noOfVisibleCards);
  const storyId = get(story, ["id"], "");
  const timezone = useSelector((state) => get(state, ["qt", "data", "timezone"], null));

  const metypeConfig = useSelector((state) => get(state, ["qt", "config", "publisher-attributes", "metypeConfig"], {}));
  const isMetypeEnabled = useSelector((state) =>
    get(state, ["qt", "config", "publisher-attributes", "enableMetype"], true)
  );
  const jwtToken = useSelector((state) => get(state, ["userReducer", "jwt_token"], null));

  const HeroVideo = () => {
    return (
      <div styleName="hero-video index-2" id={`video-${get(heroVideo, ["id"])}`}>
        <Video element={heroVideo} loadIframeOnClick={true} />
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

  const HeaderCard = () => {
    return (
      <div styleName="header-details">
        <SectionTag story={story} />
        <StoryHeadline story={story} premiumStoryIconConfig={premiumStoryIconConfig} />
        <Subheadline story={story} showFullContent />
      </div>
    );
  };

  const StoryData = ({ hasAccess }) => {
    const isStoryBehindPaywall = story.access === "subscription" && hasAccess === false;

    return (
      <div styleName="story-details">
        <div styleName="author">
          {authorCard && <AuthorCard story={story} template={authorDetails.template} opts={authorDetails.opts} />}
        </div>
        <div styleName="timestamp-social-share">
          <PublishDetails story={story} opts={publishedDetails} template="story" timezone={timezone} />
          {!verticalShare && <SocialShareComponent />}
        </div>
        {isStoryBehindPaywall ? (
          <>
            <StoryElementCard
              heroVideoElementId={heroVideo.id}
              story={story}
              card={visibledCards[0]}
              key={get(visibledCards[0], ["id"], "")}
              config={storyElementsConfig}
              adComponent={adComponent}
              widgetComp={widgetComp}
            />
            <Paywall />
          </>
        ) : (
          visibledCards.map((card) => {
            return (
              <StoryElementCard
                heroVideoElementId={heroVideo.id}
                story={story}
                card={card}
                key={get(card, ["id"], "")}
                config={storyElementsConfig}
                adComponent={adComponent}
                widgetComp={widgetComp}
              />
            );
          })
        )}
        {firstChild}
        <div styleName="story-tags">
          <StoryTags tags={story.tags} />
          <SlotAfterStory
            id={story.id}
            element={story.customSlotAfterStory}
            AdComponent={adComponent}
            WidgetComp={widgetComp}
          />
        </div>
        {secondChild}
      </div>
    );
  };

  StoryData.propTypes = {
    hasAccess: PropTypes.bool,
  };

  const SideColumn = () => {
    return (
      asideCollection && (
        <div styleName="video-story-side-column">
          <AsideCollection
            {...asideCollection}
            widgetComp={widgetComp}
            adComponent={adComponent}
            sticky={true}
            storyId={storyId}
            opts={publishedDetails}
          />
        </div>
      )
    );
  };

  const heroPriorityTemplate = (hasAccess) => {
    return (
      <>
        <HeroVideo />
        <div styleName="story-content-wrapper">
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
          <div styleName="aside-collection tablet-index-2">
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

  const headlinePriorityTemplate = (hasAccess) => {
    return (
      <>
        <div styleName="story-content-wrapper">
          <HeaderCard />
        </div>
        <div styleName="story-content-wrapper index-2">
          <HeroVideo />
        </div>
        <div styleName="story-content-wrapper">
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
        <SideColumn />
      </>
    );
  };

  const defaultTemplate = (hasAccess) => {
    return (
      <>
        <HeroVideo />
        <div styleName="story-content-wrapper">
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
        <SideColumn />
      </>
    );
  };

  const getStoryTemplate = (templateType, hasAccess) => {
    switch (templateType) {
      case "hero-priority":
        return heroPriorityTemplate(hasAccess);
      case "headline-priority":
        return headlinePriorityTemplate(hasAccess);
      default:
        return defaultTemplate(hasAccess);
    }
  };

  const templateClass = templateType && templateType !== "default" ? templateType : "default";
  const dataTestId = templateType ? `video-story-${templateType}` : "video-story";
  return (
    <div
      data-test-id={dataTestId}
      className="arrow-component arr--content-wrapper arr-story-grid arr--video-story-template-wrapper"
      styleName={`${templateClass} ${verticalShare}`}
      style={{ backgroundColor: theme }}
    >
      {getStoryTemplate(templateType, hasAccess)}
    </div>
  );
};

VideoStoryTemplate.propTypes = {
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
  hasAccess: PropTypes.func,
};

export default StateProvider(VideoStoryTemplate);
