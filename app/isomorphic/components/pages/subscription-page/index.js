import get from "lodash/get";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { func, object } from "prop-types";
import { AccessType } from "@quintype/components";
import AccountModal from "../../login/AccountModal";
import { GroupsAndPlansModal, LoginModal, CheckoutModal } from "./Modals";

import "./subscription-page.m.css";

const SubscriptionLayout = ({ initAccessType, initRazorPayPayment, getSubscription, validateCoupon, member }) => {
  const [activeTab, setActiveTab] = useState("subscription");
  const [selectedPlan, setSelectedPlan] = useState({});

  useEffect(() => {
    !global.AccessType && initAccessType();
  }, []);

  switch (activeTab) {
    case "subscription":
      return (
        <GroupsAndPlansModal
          member={member}
          setActiveTab={setActiveTab}
          selectedPlan={selectedPlan}
          setSelectedPlan={setSelectedPlan}
          getSubscription={getSubscription}
        />
      );

    case "login":
      return <LoginModal setActiveTab={setActiveTab} AccountModal={AccountModal} selectedPlan={selectedPlan} />;

    case "checkout":
      return (
        <CheckoutModal
          member={member}
          setActiveTab={setActiveTab}
          initRazorPayPayment={initRazorPayPayment}
          selectedPlan={selectedPlan}
          validateCoupon={validateCoupon}
        />
      );

    default:
      return <GroupsAndPlansModal member={member} setActiveTab={setActiveTab} getSubscription={getSubscription} />;
  }
};

SubscriptionLayout.propTypes = {
  initAccessType: func,
  initRazorPayPayment: func,
  getSubscription: func,
  validateCoupon: func,
  member: object,
};

export const SubscriptionPage = () => {
  const member = useSelector((state) => get(state, ["member"], null));
  const email = get(member, ["email"], "");
  const phone = get(member, ["metadata", "phone-number"], "");
  const { key, accessTypeBkIntegrationId } = useSelector((state) =>
    get(state, ["qt", "config", "publisher-attributes", "accesstypeConfig"], {})
  );

  return (
    <>
      <AccessType
        enableAccesstype={true}
        accessTypeKey={key}
        email={email}
        phone={phone}
        accessTypeBkIntegrationId={accessTypeBkIntegrationId}
      >
        {({ initAccessType, initRazorPayPayment, getSubscription, validateCoupon }) => (
          <SubscriptionLayout
            initAccessType={initAccessType}
            initRazorPayPayment={initRazorPayPayment}
            getSubscription={getSubscription}
            validateCoupon={validateCoupon}
            member={member}
          />
        )}
      </AccessType>
    </>
  );
};
