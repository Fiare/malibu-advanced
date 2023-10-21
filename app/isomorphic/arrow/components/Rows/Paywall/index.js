import React from "react";
import get from "lodash/get";
import { useSelector } from "react-redux";
import { Link } from "@quintype/components";
import "./paywall.m.css";

export const Paywall = () => {
  const member = useSelector((state) => get(state, ["member"], null));

  return (
    <div styleName="paywall-container">
      <div styleName="paywall-headline">Want to read full story?</div>
      <p styleName="paywall-description">
        We’re glad you’re enjoying this story. Subscribe to our plans to continue reading the story.
      </p>
      <div styleName="view-plans-btn">
        <Link href="/subscription" styleName="view-plans-link">
          View All Plans
        </Link>
      </div>
      {!member && (
        <div styleName="go-to-login">
          Already have a subscription?
          <Link href="/user-login" styleName="go-to-login-link">
            Login
          </Link>
        </div>
      )}
    </div>
  );
};
