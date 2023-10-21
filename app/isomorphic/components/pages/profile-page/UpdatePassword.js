import React, { useState } from "react";
import { func, object } from "prop-types";

import { InputField } from "../../atoms/InputField";
import { sendOtp, resetPassword } from "@quintype/bridgekeeper-js";

import "./profile-page.m.css";
import Modal from "../../login/modal";
import { useTimer } from "../../atoms/timer";

const UpdatePassword = ({ onClose, member }) => {
  const [input, setInput] = useState("");
  const [otp, setOTP] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const { start, time } = useTimer();

  const { email } = member;

  const [error, setError] = useState({});

  const setData = (e) => {
    if (e.target.id === "otp") {
      setOTP(e.target.value);
    } else {
      setInput(e.target.value);
    }
  };

  const otpHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!email) {
      setError({ message: "Email not linked" });
      return null;
    }

    const body = { "always-send": true, email: email };

    try {
      const reponse = await sendOtp(body);
      if (reponse.status === 200) {
        setShowOtp(true);
        start(30);
        setError({});
      } else {
        setError({ message: `${reponse.message}, Click on proceed to resend OTP` });
      }
    } catch (error) {
      setError(error);
    }
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (input.length < 1 || otp.length < 1) {
      setError({ message: "Please provide valid data" });
      return null;
    }
    try {
      const body = {
        email: email,
        otp: otp,
        "new-password": input,
      };

      const response = await resetPassword(body);

      if (response.message) {
        onClose();
      } else {
        setError({ message: response?.error?.message || "Error" });
      }
    } catch (err) {
      setError(err);
      console.warn("error", err);
    }
  };

  return (
    <Modal onClose={onClose}>
      <form styleName="malibu-form-link">
        <>
          <h3>Reset your Password</h3>
          {!showOtp ? (
            <>
              <p styleName="fields">
                A One Time Password code will be sent via email to {member.email} for verification
              </p>
              {error && <p styleName="otp-error">{error.message}</p>}
              <button
                aria-label="login-button"
                onClick={otpHandler}
                styleName="btn-submit"
                className="malibu-btn-large"
              >
                Proceed
              </button>
            </>
          ) : (
            <>
              <p styleName="fields">A One Time Password code was sent via email to {member.email}</p>
              <InputField name="OTP" id="otp" type="number" required onChange={setData} />
              <InputField name="Password" id="password" type="password" required onChange={setData} />
              {error && <p styleName="otp-error">{error.message}</p>}
              <button
                aria-label="login-button"
                onClick={updateHandler}
                styleName="btn-submit"
                className="malibu-btn-large"
              >
                Reset Password
              </button>
              <button
                disabled={time > 0}
                aria-label="resend-otp-button"
                onClick={otpHandler}
                styleName="resend-otp-btn"
              >
                Resend OTP
              </button>
              {time > 0 && (
                <p styleName="resend-otp">
                  Resend OTP in <span>{`0.${time}`}</span>
                </p>
              )}
            </>
          )}
        </>
      </form>
    </Modal>
  );
};

UpdatePassword.propTypes = {
  onClose: func,
  member: object,
};

export default UpdatePassword;
