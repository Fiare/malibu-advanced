/* eslint-disable max-len */
export const PAGE_TYPE = Object.freeze({
  HOME_PAGE: "home-page",
  SECTION_PAGE: "section-page",
  COLLECTION_PAGE: "collection-page",
  TAG_PAGE: "tag-page",
  SEARCH_PAGE: "search-page",
  STORY_PAGE: "story-page",
  CATALOG_PAGE: "catalog-page",
  STORY_PUBLIC_PREVIEW_PAGE: "story-public-preview-page",
  STORY_PREVIEW: "story-preview",
  HOME_PREVIEW: "home-preview",
  STATIC_PAGE: "static-page",
  FORM_PAGE: "form-page",
  AUTHOR_PAGE: "author-page",
  SUBSCRIPTION_PAGE: "subscription-page",
  RESET_PASSWORD_PAGE: "reset-password-page",
  PROFILE_PAGE: "profile-page",
  USER_LOGIN: "user-login",
  VISUAL_STORY: "visual-story",
  UGC_PAGE: "ugc-page",
});
export const TAG_PAGE_URL_PREFIX = "/topic/";

export const storyFields =
  "headline,subheadline,sections,author-name,authors,hero-image-metadata,hero-image-s3-key,slug,id";

export const STORY_FIELDS =
  "id,metadata,story-template,headline,sections,slug,hero-image-s3-key,hero-image-metadata,author-name,author-id,authors,url,alternative,last-published-at,first-published-at,hero-image-caption,read-time";
