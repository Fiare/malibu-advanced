/* eslint-disable no-unused-vars, no-console, react/jsx-indent-props,react/jsx-wrap-multilines, no-undef, react/jsx-closing-bracket-location */

import React, { useEffect, useState } from "react";
import { AccessType, InfiniteStoryBase, WithPreview } from "@quintype/components";
import { object, shape, string } from "prop-types";

import StoryWrapper from "../story-templates/story-wrapper";
import { useSelector } from "react-redux";
import get from "lodash/get";

function StoryPageBaseWithAccesstype({ story, config }) {
  const [isATGlobal, setIsATGlobal] = useState(false);
  const member = useSelector((state) => get(state, ["member"], null));
  const email = get(member, ["email"], "");
  const phone = get(member, ["metadata", "phone-number"], "");
  const { key, accessTypeBkIntegrationId } = useSelector((state) =>
    get(state, ["qt", "config", "publisher-attributes", "accesstypeConfig"], {})
  );

  return (
    <AccessType
      enableAccesstype={true}
      accessTypeKey={key}
      email={email}
      phone={phone}
      accessTypeBkIntegrationId={accessTypeBkIntegrationId}
      onATGlobalSet={() => {
        setIsATGlobal(true);
      }}
    >
      {({ initAccessType, checkAccess }) => (
        <StoryWrapper
          isATGlobal={isATGlobal}
          story={story}
          config={config}
          initAccessType={initAccessType}
          checkAccess={checkAccess}
        />
      )}
    </AccessType>
  );
}

StoryPageBaseWithAccesstype.propTypes = {
  story: object,
  config: object,
};
function StoryPageBase({ story, config }) {
  return <StoryPageBaseWithAccesstype story={story} config={config} />;
}

StoryPageBase.propTypes = {
  story: object,
  config: object,
};

const FIELDS =
  "id,headline,slug,url,hero-image-s3-key,hero-image-metadata,first-published-at,last-published-at,alternative,published-at,author-name,author-id,sections,authors,story-template,cards,access";
function storyPageLoadItems(pageNumber) {
  return global
    .wretch("/api/v1/stories")
    .query({
      fields: FIELDS,
      limit: 5,
      offset: 5 * pageNumber,
    })
    .get()
    .json((response) =>
      response.stories.map((story) => ({ story, currentPath: `/${story.slug}`, otherProp: "value" }))
    );
}

export function StoryPage(props) {
  return (
    <div className="container">
      <InfiniteStoryBase
        {...props}
        render={StoryPageBase}
        loadItems={storyPageLoadItems}
        onInitialItemFocus={(item) =>
          app.registerPageView({ pageType: "story-page", data: { story: item.story } }, `/${item.story.slug}`)
        }
        onItemFocus={(item) => console.log(`Story In View: ${item.story.headline}`)}
        changeUrlTo={(item) => item.currentPath || props.currentPath}
      />
    </div>
  );
}

StoryPage.propTypes = {
  data: shape({
    story: object,
    config: object,
  }),
  currentPath: string,
};

export const StoryPagePreview = WithPreview(StoryPage, (data, story) =>
  Object.assign({}, data, {
    story,
    relatedStories: Array(5).fill(story),
  })
);
