import React, { useEffect, useState } from "react";
import { object, func } from "prop-types";
import get from "lodash/get";

import "./group-and-plans.m.css";

export const GroupsAndPlansModal = ({ member, setActiveTab, setSelectedPlan, getSubscription }) => {
  const [subscriptionsData, setSubscriptionsData] = useState([]);
  const [selectedSubscriptions, setSelectedSubscriptions] = useState({});

  useEffect(() => {
    getSubscription().then((res) => setSubscriptionsData(res));
  }, []);

  useEffect(() => {
    const defaultSelectedOptions = {};
    subscriptionsData.forEach((group, id) => {
      const firstPlan = get(group, ["subscription_plans", "0"]);
      defaultSelectedOptions[group.name] = firstPlan;
    });
    setSelectedSubscriptions(defaultSelectedOptions);
  }, [subscriptionsData]);

  const handlePlanSelection = (groupName) => {
    setSelectedPlan({ plan: selectedSubscriptions[groupName] });
    member ? setActiveTab("checkout") : setActiveTab("login");
  };

  return (
    <>
      <div styleName="title">Choose A Plan</div>
      <p styleName="description">
        From daily newsletters to monthly digests, our flexible subscription options cater to your information needs.
        Subscribe now for comprehensive coverage and expert insights.
      </p>
      <div styleName="groups">
        {subscriptionsData.map((group, id) => {
          return (
            <div key={id} styleName="group-card">
              <div styleName="group-name">{group.name}</div>
              <div styleName="plan-name">
                <select
                  styleName="select-option"
                  onChange={(e) =>
                    setSelectedSubscriptions({ ...selectedSubscriptions, [group.name]: JSON.parse(e.target.value) })
                  }
                >
                  {group.subscription_plans.map((plan, id) => {
                    return (
                      // eslint-disable-next-line react/jsx-key
                      <option key={id} value={JSON.stringify(plan)}>
                        {`${plan.duration_length} ${
                          plan.duration_length === 1
                            ? plan.duration_unit.substring(0, plan.duration_unit.length - 1)
                            : plan.duration_unit
                        } ${plan.price_cents / 100} ${plan.price_currency}`}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div styleName="plan-description">{group.description}</div>
              <button styleName="subscribe-btn" onClick={() => handlePlanSelection(group.name)}>
                Subscribe
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
};

GroupsAndPlansModal.propTypes = {
  member: object,
  setActiveTab: func,
  initAccessType: func,
  subscriptionsData: object,
  setSelectedPlan: func,
  getSubscription: func,
};
