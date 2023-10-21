import React, { useEffect, useState } from "react";
import { object, func } from "prop-types";
import { SvgIconHandler } from "../../atoms/svg-icon-hadler";
import { ProfileCard } from "./ProfileCard";
import { EditProfile } from "./EditProfile";
import { EndDateText } from "./EndDateText";

import "./profile-page.m.css";

export const ProfilePageWithAccesstype = ({
  initAccessType,
  member,
  getSubscriptionForUser,
  cancelSubscription,
  isATGlobal,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [subscriptions, setSubscriptions] = useState(null);

  useEffect(() => {
    initAccessType(() => {
      getSubscriptionForUser()
        .then((res) => {
          setSubscriptions(res.subscriptions);
        })
        .catch((err) => console.error("Error occurred inside profile page --->", err));
    });
  }, [global.AccessType, member, isATGlobal]);

  const cancelSubscriptionHandler = (subscriptionId) => {
    const subscriptionIndex = subscriptions.findIndex((subscription) => subscription.id === subscriptionId);
    cancelSubscription(subscriptionId)
      .then((res) => {
        const updatedSubscriptions = [
          ...subscriptions.slice(0, subscriptionIndex),
          ...subscriptions.slice(subscriptionIndex + 1),
        ];
        setSubscriptions(updatedSubscriptions);
      })
      .catch((err) => console.error("Error from cancelSubscription is --->", err));
  };

  const getActiveSubscriptions = (subscriptions = []) => {
    const activeSubscriptions = subscriptions
      .filter((plan) => plan.subscription_type === "standard" || plan.subscription_type === "group_access")
      .filter((plan) => plan.status === "active");

    if (activeSubscriptions.length === 0) return null;

    return (
      <div>
        <div styleName="active-plan-label">{activeSubscriptions.length === 1 ? "ACTIVE PLAN" : "ACTIVE PLANS"}</div>
        {activeSubscriptions.map((subscription, id) => {
          return (
            <div styleName="plan" key={id}>
              <span styleName="plan-name">{`${subscription.plan_name}`}</span>
              <EndDateText subscription={subscription} />
              <button styleName="button" onClick={() => cancelSubscriptionHandler(subscription.id)}>
                Cancel Subscription
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  const getExpiredSubscriptions = (subscriptions = []) => {
    const expiredPlans = subscriptions.filter(
      (plan) =>
        plan.status === "expired" &&
        (plan.subscription_type === "standard" || plan.subscription_type === "group_access")
    );

    if (expiredPlans.length === 0) return null;

    return (
      <div>
        <div styleName="active-plan-label">{expiredPlans.length === 1 ? "EXPIRED PLAN" : "EXPIRED PLANS"}</div>
        {expiredPlans.map((subscription, id) => {
          return (
            <div styleName="plan" key={id}>
              <span styleName="plan-name">{`${subscription.plan_name}`}</span>
              <EndDateText subscription={subscription} />
            </div>
          );
        })}
      </div>
    );
  };

  if (!member) {
    return <div styleName="not-logged-in">Please Login</div>;
  }

  return (
    <div styleName="profile-page">
      <div styleName="my-account">My Account</div>
      <div styleName="profile-card">
        <div styleName="avatar">
          {member["avatar-url"] ? (
            <img src={member["avatar-url"]} alt="avatar" height="160px" width="160px" styleName="avatar-image" />
          ) : (
            <SvgIconHandler type="user" styleName="user-icon" />
          )}
        </div>

        {isEditing ? (
          <EditProfile member={member} setIsEditing={setIsEditing} isEditing={isEditing} />
        ) : (
          <div>
            <ProfileCard member={member} />
            <div styleName="buttons-container">
              <button styleName="button" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </div>
            {subscriptions === null ? (
              <div>
                <b>Loading...</b>
                <p>We are finding your subscriptions, Please wait</p>
              </div>
            ) : (
              <>
                {getActiveSubscriptions(subscriptions)}
                {getExpiredSubscriptions(subscriptions)}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

ProfilePageWithAccesstype.propTypes = {
  initAccessType: func,
  member: object,
  getSubscriptionForUser: func,
  cancelSubscription: func,
  isATGlobal: func,
};
