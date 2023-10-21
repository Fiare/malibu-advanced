import React from "react";
import PropTypes from "prop-types";
import kebabCase from "lodash/kebabCase";
import { Dot } from "../Dot/dot";
import { ResponsiveImage, Link } from "@quintype/components";
import { Twitter } from "../../Svgs/SocialIcons/twitter";
import "./author-card.m.css";
import { useStateValue } from "../../SharedContext";
import { getTextColor, getAuthorTwitterUrl } from "../../../utils/utils";

const authorImage = (author) => {
  const { "avatar-url": avatarUrl, "avatar-s3-key": avatarS3Key, name: authorName } = author;
  if (!avatarUrl && !avatarS3Key) {
    return null;
  }
  return (
    <figure data-test-id="author-image">
      {avatarS3Key ? (
        <ResponsiveImage
          slug={avatarS3Key}
          aspect-ratio={[1, 1]}
          defaultWidth={48}
          imgParams={{ auto: ["format", "compress"] }}
          alt={authorName}
        />
      ) : (
        <img src={avatarUrl} />
      )}
    </figure>
  );
};

export const AuthorCard = ({ story = {}, template = "leftAligned", clazzName = "", opts = {}, mountAt = "" }) => {
  const configData = useStateValue() || {};
  const { authors = [] } = story;
  const isSingleAuthor = authors.length === 1;
  const { showBio = false, showImage = true, showName = true } = opts;
  const textColor = getTextColor(configData.theme);
  let twitterUrl = "";
  if (isSingleAuthor) {
    twitterUrl = getAuthorTwitterUrl(authors[0]);
  }

  const flexType = authors.length > 1 ? "column" : "row";

  return (
    <div
      data-test-id={`author-card-${kebabCase(template)}`}
      className={clazzName}
      styleName={`author-card-wrapper ${flexType} ${template}`}
    >
      <div styleName="author-images">
        {authors.map((author, index) => {
          return (
            <React.Fragment key={author.id}>
              {showImage && (author["avatar-url"] || author["avatar-s3-key"]) && (
                <div data-test-id="author-image" styleName="author-image-wrapper">
                  <Link
                    href={`${mountAt}/author/` + author.slug}
                    key={`author-image-${index}`}
                    aria-label="author-image"
                  >
                    <div
                      styleName={`author-image ${!index ? "first-author-image" : ""} ${
                        !isSingleAuthor ? "multi-author-image" : ""
                      }`}
                    >
                      {authorImage(author)}
                    </div>
                  </Link>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {showName && (
        <div data-test-id="author-name" styleName="author-name-share">
          {authors.map((author, index) => {
            const spaceHolder = `,\xa0`;
            return (
              <>
                {index !== 0 && (authors.length > 1 ? spaceHolder : "")}
                <Link href={`${mountAt}/author/` + author.slug} aria-label="author-name">
                  <h5 styleName={`multiple-author-style ${textColor}`}>{author.name}</h5>
                </Link>
              </>
            );
          })}
          {isSingleAuthor && template !== "centerAligned" && (
            <>
              {twitterUrl && (
                <>
                  <div styleName="dot-wrapper">
                    <Dot color={textColor} />
                  </div>
                  <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                    <Twitter />
                  </a>
                </>
              )}
            </>
          )}
        </div>
      )}
      <div data-test-id="author-info" styleName="author-details-wrapper">
        {showBio && isSingleAuthor && template !== "default" && (
          <p styleName={`author-bio ${textColor}`}>{authors[0].bio}</p>
        )}
      </div>
    </div>
  );
};

AuthorCard.propTypes = {
  story: PropTypes.shape({
    authors: PropTypes.array,
  }),
  template: PropTypes.string,
  opts: PropTypes.shape({
    showImage: PropTypes.bool,
    showBio: PropTypes.bool,
    showName: PropTypes.bool,
  }),
  mountAt: PropTypes.string,
  clazzName: PropTypes.string,
};
