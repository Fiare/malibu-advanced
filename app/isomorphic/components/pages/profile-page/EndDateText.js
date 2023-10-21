import React from "react";
import { object } from "prop-types";

export const EndDateText = ({ subscription }) => {
  if (subscription.expired) {
    return (
      <p>
        Subscription has been expired on:
        <span>
          {new Date(subscription.end_timestamp).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </p>
    );
  } else {
    return (
      <p>
        {subscription.recurring ? "Renews on:" : "Expires on:"}{" "}
        <span>
          {new Date(subscription.end_timestamp).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
      </p>
    );
  }
};

EndDateText.propTypes = {
  subscription: object,
};
