import React, { useState } from "react";
import { func, object } from "prop-types";

import "./checkout-modal.m.css";

const currencyLabels = {
  INR: "Rs.",
};

export const CheckoutModal = ({ member, setActiveTab, initRazorPayPayment, selectedPlan, validateCoupon }) => {
  const [couponCode, setCouponCode] = useState("");
  const [showCouponCode, setShowCouponCode] = useState(false);
  const [isCouponApplied, setIsCouponApplied] = useState("");
  const [plan, setPlan] = useState(selectedPlan.plan);

  return (
    <div styleName="modal">
      <div styleName="checkout-label">Checkout</div>
      <div styleName="secure">100% secure</div>
      <div styleName="current-step">Step 1 of 2</div>
      {member && (
        <div styleName="change-account">
          <div styleName="label">Account</div>
          <span>{member.name}</span>
          <span styleName="not-you-btn" onClick={() => setActiveTab("login")}>
            Not you?
          </span>
        </div>
      )}
      <div styleName="checkout-container">
        <div>
          <div styleName="label">Plan Details</div>
          <div styleName="plan-preview">
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
          <div styleName="plan-and-coupon-btns">
            <div styleName="change-plan-btn" onClick={() => setActiveTab("subscription")}>
              Change Plan
            </div>
            {!showCouponCode && (
              <div styleName="add-coupon-code-btn" onClick={() => setShowCouponCode(true)}>
                Add Coupon Code
              </div>
            )}
          </div>
          {showCouponCode && (
            <div>
              <div styleName="coupon-code-label">Coupon code</div>
              <div styleName="coupon-apply">
                <input
                  styleName="coupon-code-input"
                  value={couponCode}
                  type="text"
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <div
                  onClick={() => {
                    validateCoupon(plan.id, couponCode)
                      .then((res) => {
                        if (res.valid) {
                          const updatedPlan = { ...plan };
                          updatedPlan.coupon_code = couponCode;
                          updatedPlan.discounted_price_cents = res.discount_details.discounted_price_cents;
                          updatedPlan.coupon_discount = res.discount_details.value;
                          setIsCouponApplied("applied");
                          setPlan(updatedPlan);
                        } else {
                          setIsCouponApplied("failed");
                        }
                      })
                      .catch((err) => console.error(`Coupon code error: ${err}`));
                  }}
                  styleName="apply-coupon-btn"
                >
                  Apply
                </div>
              </div>
            </div>
          )}
          {isCouponApplied === "applied" && (
            <div styleName="amount-saved">{`You saved ${currencyLabels[plan.price_currency]} ${
              (plan.price_cents - plan.discounted_price_cents) / 100
            }/-`}</div>
          )}
          {isCouponApplied === "failed" && <div styleName="coupon-error">This coupon code is invalid</div>}
        </div>
        <div styleName="total-payment">
          <div styleName="label">To Pay</div>
          <div styleName="price">{`${currencyLabels[plan.price_currency]} ${
            plan.discounted_price_cents !== undefined ? plan.discounted_price_cents / 100 : plan.price_cents / 100
          }/-`}</div>
        </div>
        <div>
          <div styleName="label">Payment Method</div>
          <input type={"radio"} id={"credit-debit-cards"} value={"razorpay"} checked />
          <label styleName="radio-label" htmlFor="credit-debit-cards">
            Credit/Debit Cards, UPI
          </label>
          <button
            styleName="proceed-to-payment-btn"
            onClick={async () => {
              const updatedPlan = JSON.parse(JSON.stringify(plan));
              updatedPlan.coupon_code = couponCode;
              const paymentResponse =
                updatedPlan.discounted_price_cents === 0 || updatedPlan.price_cents === 0
                  ? await initRazorPayPayment(updatedPlan, "standard", "", "", "", "skip_payment_gateway")
                  : await initRazorPayPayment(updatedPlan, "standard");
              if (paymentResponse.subscription) {
                window.location.href = "/profile";
              }
            }}
          >
            {`Proceed to Pay ${currencyLabels[plan.price_currency]} ${
              plan.discounted_price_cents !== undefined ? plan.discounted_price_cents / 100 : plan.price_cents / 100
            }/-`}
          </button>
        </div>
      </div>
    </div>
  );
};

CheckoutModal.propTypes = {
  member: object,
  setActiveTab: func,
  initRazorPayPayment: func,
  selectedPlan: object,
  validateCoupon: func,
};
