/* eslint-disable react/no-unknown-property */
import React from "react";
import { useSelector } from "react-redux";
import get from "lodash/get";
import PropTypes from "prop-types";
import { SocialShareTemplate } from "../../../Molecules/SocialShareTemplate";
import { SocialShare } from "@quintype/components";
import { SectionTag } from "../../../Atoms/SectionTag";
import { StoryHeadline } from "../../../Atoms/StoryHeadline";
import { Subheadline } from "../../../Atoms/Subheadline";
import AsideCollection from "../../AsideCollection";
import { AuthorCard } from "../../../Atoms/AuthorCard";
import { CaptionAttribution } from "../../../Atoms/CaptionAttribution";
import { HeroImage } from "../../../Atoms/HeroImage";
import { PublishDetails } from "../../../Atoms/PublishDetail";
import { StoryTags } from "../../../Atoms/StoryTags";
import { StoryElementCard, SlotAfterStory } from "../../../Molecules/StoryElementCard";
import { MetypeCommentsWidget } from "../../../../../components/Metype/commenting-widget";
import { MetypeReactionsWidget } from "../../../../../components/Metype/reaction-widget";

import "./text-story.m.css";
import { Paywall } from "../../Paywall";

export const StoryTemplate = ({
  story = {},
  config = {},
  storyElementsConfig,
  widgetComp,
  adComponent,
  firstChild,
  secondChild,
  timezone,
  hasAccess,
}) => {
  const {
    theme = "",
    asideCollection = {},
    templateType = "default",
    noOfVisibleCards = -1,
    publishedDetails = {},
    authorDetails = {
      template: "default",
    },
    verticalShare = "",
    shareIconType = "plain-color-svg",
    premiumStoryIconConfig = {},
  } = config;
  const metypeConfig = useSelector((state) => get(state, ["qt", "config", "publisher-attributes", "metypeConfig"], {}));
  const isMetypeEnabled = useSelector((state) =>
    get(state, ["qt", "config", "publisher-attributes", "enableMetype"], true)
  );
  const jwtToken = useSelector((state) => get(state, ["userReducer", "jwt_token"], null));
  const visibledCards = noOfVisibleCards < 0 ? story.cards : story.cards.slice(0, noOfVisibleCards);
  const storyId = get(story, ["id"], "");
  const HeaderCard = () => {
    return (
      <div styleName="header-details">
        <SectionTag story={story} />
        <StoryHeadline story={story} premiumStoryIconConfig={premiumStoryIconConfig} />
        <Subheadline story={story} showFullContent />
      </div>
    );
  };

  const AsideCollectionCard = () => {
    return (
      asideCollection && (
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
      )
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
      <div styleName="gap-16">
        {authorDetails && <AuthorCard story={story} template={authorDetails.template} opts={authorDetails.opts} />}
        <div styleName="timestamp-social-share">
          <PublishDetails story={story} opts={publishedDetails} template="story" timezone={timezone} />
          {!verticalShare && <SocialShareComponent />}
        </div>
        {isStoryBehindPaywall ? (
          <>
            <StoryElementCard
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
      </div>
    );
  };

  const SideColumn = () => {
    return (
      asideCollection && (
        <div styleName="text-story-side-column">
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

  const heroPriorityCenterTemplate = (hasAccess) => {
    return (
      <>
        <div styleName="hero-image index-2" data-test-id="hero-priority-center-image">
          <HeroImage story={story} FullBleed={false} aspectRatio={[[16, 9]]} defaultFallback={false} isStoryPageImage />
        </div>
        <div styleName="story-content-inner-wrapper">
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
        <AsideCollectionCard />
      </>
    );
  };

  const headlineHeroPriorityTemplate = (hasAccess) => {
    return (
      <>
        <div styleName="story-content-inner-wrapper">
          <HeaderCard />
        </div>
        <div styleName="hero-image index-2" data-test-id="headline-hero-priority-image">
          <HeroImage story={story} FullBleed={false} aspectRatio={[[16, 9]]} defaultFallback={false} isStoryPageImage />
        </div>
        <div styleName="story-content-inner-wrapper">
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
        <AsideCollectionCard />
      </>
    );
  };

  const heroVerticalTemplate = (hasAccess) => {
    return (
      <>
        <HeaderCard />
        <div styleName="hero-image index-2" data-test-id="hero-vertical-image">
          <HeroImage story={story} FullBleed={false} aspectRatio={[[3, 4]]} defaultFallback={false} isStoryPageImage />
        </div>
        <CaptionAttribution story={story} config={config} />
        <div styleName="story-content-inner-wrapper">
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
        <AsideCollectionCard />
      </>
    );
  };

  const heroPriorityLeftTemplate = (hasAccess) => {
    return (
      <>
        <div styleName="hero-image index-2" data-test-id="hero-priority-left-image">
          <HeroImage story={story} FullBleed={false} aspectRatio={[[16, 9]]} defaultFallback={false} isStoryPageImage />
        </div>
        <div styleName="story-content-inner-wrapper">
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
        <SideColumn />
      </>
    );
  };

  const headlinePriorityTemplate = (hasAccess) => {
    return (
      <>
        <HeaderCard />
        <div styleName="story-content-inner-wrapper hero-image index-2" data-test-id="headline-priority-hero-image">
          <HeroImage story={story} FullBleed={false} aspectRatio={[[16, 9]]} defaultFallback={false} isStoryPageImage />
        </div>
        <div styleName="story-content-inner-wrapper">
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
        <SideColumn />
      </>
    );
  };

  const headlineOverlayTemplate = (hasAccess) => {
    return (
      <>
        <div styleName="hero-image index-2" data-test-id="headline-overlay-hero-image">
          <HeroImage
            story={story}
            FullBleed={false}
            aspectRatio={[
              [3, 4],
              [16, 9],
            ]}
            isStoryPageImage
          />
        </div>
        <HeaderCard />
        <div styleName="story-content-inner-wrapper">
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
        <AsideCollectionCard />
      </>
    );
  };

  const getStoryTemplate = (templateType, hasAccess) => {
    switch (templateType) {
      case "hero-priority-center":
        return heroPriorityCenterTemplate(hasAccess);
      case "default":
        return heroPriorityLeftTemplate(hasAccess);
      case "headline-hero-priority":
        return headlineHeroPriorityTemplate(hasAccess);
      case "hero-vertical-priority":
        return heroVerticalTemplate(hasAccess);
      case "headline-priority":
        return headlinePriorityTemplate(hasAccess);
      case "headline-overlay-priority":
        return headlineOverlayTemplate(hasAccess);
    }
  };
  return <>{getStoryTemplate(templateType, hasAccess)}</>;
};

StoryTemplate.propTypes = {
  story: PropTypes.object,
  config: PropTypes.shape({
    templateType: PropTypes.string,
    authorDetails: PropTypes.object,
    asideCollection: PropTypes.object,
  }),
  firstChild: PropTypes.node,
  secondChild: PropTypes.node,
  timezone: PropTypes.string,
  storyElementsConfig: PropTypes.object,
  widgetComp: PropTypes.func,
  adComponent: PropTypes.func,
  hasAccess: PropTypes.bool,
};
