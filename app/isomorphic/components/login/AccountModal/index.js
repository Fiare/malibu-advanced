import React, { useState, useEffect } from "react";
import { func, bool, string } from "prop-types";

import { sendOtp } from "@quintype/bridgekeeper-js";

import Modal from "../modal";
import { Login } from "../../molecules/forms/login";
import { SignUp } from "../../molecules/forms/sign-up";
import { OTP } from "../../molecules/forms/otp";
import { ForgotPassword } from "../../molecules/forms/forgot-password";

import "./account-modal.m.css";
import PhoneLogin from "../../molecules/forms/phoneLogin";

const AccountModal = ({ onClose, isPopup = true, customCallbackUrl }) => {
  const [activeTab, setActiveTab] = useState("login");
  const [member, setMember] = useState(null);
  const [otpToken, setOtpToken] = useState(null);
  const [renderModal, setRenderModal] = useState(false);

  useEffect(() => {
    setRenderModal(true);
  }, []);

  const otpHandler = (member, otpDetails) => {
    setMember(member);
    setOtpToken(otpDetails["email-token"]);
    setActiveTab("otp");
  };

  const onSuccess = async (member) => {
    try {
      const data = { email: member.email };
      const otpDetails = await sendOtp(data);
      otpHandler(member, otpDetails);
    } catch (err) {
      console.log(err);
    }
  };

  if (!renderModal && !isPopup) {
    return null;
  }

  const getScreen = () => {
    switch (activeTab) {
      case "login":
        return (
          <Login
            onLogin={(member, res) => otpHandler(member, res)}
            forgotPassword={() => setActiveTab("forgot-password")}
            setLoginOption={setActiveTab}
            customCallbackUrl={customCallbackUrl}
          />
        );
      case "phone":
        return <PhoneLogin onLogin={(member, res) => otpHandler(member, res)} setLoginOption={setActiveTab} />;
      case "register":
        return (
          <SignUp
            onSignup={(member) => onSuccess(member)}
            onLogin={() => {
              setActiveTab("login");
            }}
            customCallbackUrl={customCallbackUrl}
          />
        );
      case "otp":
        return <OTP id={otpToken} member={member} />;
      case "forgot-password":
        return <ForgotPassword onClose={onClose} activeLoginTab={() => setActiveTab("login")} />;
      default:
        return null;
    }
  };

  const getActiveTabHeading = () => {
    if (activeTab === "forgot-password")
      return (
        <ul styleName="tabs">
          <li styleName={`tab-item active`}>Forgot Password</li>
        </ul>
      );

    return (
      <ul styleName="tabs">
        <li onClick={() => setActiveTab("login")} styleName={`tab-item ${activeTab === "login" ? "active" : ""}`}>
          Login
        </li>
        <li onClick={() => setActiveTab("register")} styleName={`tab-item ${activeTab === "register" ? "active" : ""}`}>
          Register
        </li>
      </ul>
    );
  };

  return isPopup ? (
    <Modal onClose={onClose}>
      <div styleName="account-modal">
        <div styleName="form-wrapper">
          {activeTab !== "phone" && getActiveTabHeading()}
          <div className="forms">{getScreen()}</div>
        </div>
      </div>
    </Modal>
  ) : (
    <div styleName="account-modal">
      <div styleName="form-wrapper" className="form-wrapper">
        {activeTab !== "phone" && getActiveTabHeading()}
        <div className="forms">{getScreen()}</div>
      </div>
    </div>
  );
};

AccountModal.propTypes = {
  onClose: func,
  isPopup: bool,
  customCallbackUrl: string,
};

export default AccountModal;
