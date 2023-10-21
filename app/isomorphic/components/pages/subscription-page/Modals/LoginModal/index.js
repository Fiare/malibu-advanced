import React, { useState } from "react";
import { func, object } from "prop-types";

import "./login-modal.m.css";

const currencyLabels = {
  INR: "Rs.",
};

export const LoginModal = ({ setActiveTab, AccountModal, selectedPlan }) => {
  const [showAccountModal, setShowAccountModal] = useState(true);

  const { plan } = selectedPlan;
  return (
    <div styleName="modal">
      <div styleName="checkout-label">Checkout</div>
      <div styleName="secure">100% secure</div>
      <div styleName="current-step">Step 1 of 2</div>
      <div styleName="login-modal">
        {showAccountModal && (
          <AccountModal
            isPopup={false}
            customCallbackUrl={global.location.href}
            onClose={() => {
              setShowAccountModal(false);
              setActiveTab("checkout");
            }}
          />
        )}
      </div>
      <div styleName="plan-preview">
        <div styleName="label">Plan Details</div>
        <div styleName="plan-details">
          <div styleName="plan-name-and-price">
            <div styleName="group-plan-name">{`${plan.title} - ${
              plan.recurring ? "Recurring Plan" : "One Time Plan"
            }`}</div>
            <div styleName="price">{`${currencyLabels[plan.price_currency]} ${plan.price_cents / 100}/-`}</div>
          </div>
        </div>
        <div styleName="validity">{`Valid for ${plan.duration_length} ${
          plan.duration_length === 1
            ? plan.duration_unit.substring(0, plan.duration_unit.length - 1)
            : plan.duration_unit
        }`}</div>
      </div>
    </div>
  );
};

LoginModal.propTypes = {
  setActiveTab: func,
  AccountModal: func,
  selectedPlan: object,
};
