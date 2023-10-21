/* eslint-disable react/no-unknown-property */
import React, { useEffect, useState } from "react";
import get from "lodash/get";
import { connect } from "react-redux";
import { object } from "prop-types";

import { MetypeContributionWidget } from "../../../components/Metype/contribution-widget";

import "./ugc.m.css";

const UgcPageBase = ({ publisherAttributes }) => {
  const { metypeConfig, publisherName, metypeUgcConfig } = publisherAttributes;
  const metypeObj = metypeUgcConfig || metypeConfig;
  const [isIframe, setIframe] = useState(false);

  useEffect(() => {
    setIframe(true);
  }, []);

  return (
    <div styleName="ugc-wrapper">
      {isIframe && (
        <MetypeContributionWidget
          host={metypeObj.metypeHost}
          accountId={metypeObj.metypeAccountId}
          publisher={publisherName}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  publisherAttributes: get(state, ["qt", "config", "publisher-attributes"], {}),
});

UgcPageBase.propTypes = {
  publisherAttributes: object,
};

export const UgcPage = connect(mapStateToProps)(UgcPageBase);
