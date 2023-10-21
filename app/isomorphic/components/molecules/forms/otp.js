import React, { useEffect, useState } from "react";
import PT from "prop-types";
import { login, sendOtp, updateWithOtp, currentUser, oauthAuthorize } from "@quintype/bridgekeeper-js";
import { parseUrl } from "query-string";

import { InputField } from "../../atoms/InputField";
import get from "lodash/get";
import { useDispatch, useSelector } from "react-redux";
import { MEMBER_UPDATED } from "../../store/actions";

import "./forms.m.css";
import { useTimer } from "../../atoms/timer";

const OTP = ({ member, customCallbackUrl }) => {
  const [otp, setOTP] = useState("");
  const [error, setError] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const qtConfig = useSelector((state) => get(state, ["qt"], {}));
  const publisherAttributes = get(qtConfig, ["config", "publisher-attributes"], {});
  const currentPath = get(qtConfig, ["currentPath"], "");
  const clientId = get(publisherAttributes, ["sso_login", "client_id"], "");
  const ssoLoginIsEnable = get(publisherAttributes, ["sso_login", "is_enable"], false);

  const dispatch = useDispatch();
  const { start, time } = useTimer();

  useEffect(() => {
    start(30);
  }, []);

  const getCurrentUser = async () => {
    try {
      const currentUserResp = await currentUser();
      dispatch({ type: MEMBER_UPDATED, member: get(currentUserResp, ["user"], null) });
    } catch (err) {
      console.log("error--------", err);
    }
  };

  const otpHandler = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const user = {
        "verification-status": "email",
      };
      const response = await updateWithOtp(otp, user);

      if (response.status === 200) {
        setSuccessMsg("Verification successful. Please login");
      } else {
        setSuccessMsg("Error while processing OTP. Please try again!");
      }
    } catch (err) {
      setError(true);
      console.warn("error", error);
    }
  };

  const otpLogin = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const data = {
      "phone-number": member["phone-number"],
      otp: otp,
      "auto-signup": true,
    };

    try {
      const response = await login(data);
      if (!response.user) {
        setError({ response });
        return;
      }
      await getCurrentUser();
      console.log("loged in successfully");
      const params = parseUrl(currentPath);
      const callbackUrl =
        customCallbackUrl ||
        get(params, ["query", "callback_uri"]) ||
        get(publisherAttributes, ["sso_login", "callback_Url"], "");
      const redirectUrl =
        get(params, ["query", "redirect_uri"]) || get(publisherAttributes, ["sso_login", "redirect_Url"], "");
      const allowAjax = true;
      const oauthResponse = ssoLoginIsEnable && (await oauthAuthorize(clientId, redirectUrl, callbackUrl, allowAjax));
      if (oauthResponse.redirect_uri) window.location.href = oauthResponse.redirect_uri;
    } catch (error) {
      setError(true);
      console.warn("error", error);
    }
  };

  const setData = (e) => {
    setOTP(e.target.value);
  };

  const resendOTP = async () => {
    const resendMode = member.isPhoneLogin ? "phone-number" : "email";
    const data = {
      [resendMode]: member[resendMode],
    };
    try {
      start(30);
      const res = await sendOtp(data);
      if (res.status === 200) {
        setSuccessMsg(`OTP Sent to your registered ${member.isPhoneLogin ? "phone" : "email"}`);
      } else {
        setError(res.error || res);
      }
    } catch (error) {
      setError(error);
    }
  };

  return (
    <React.Fragment>
      <p styleName="otp-text">
        A One Time Password code was sent via {`${member.isPhoneLogin ? "phone" : "email"}`} to{" "}
        <span>{member.email || member["phone-number"]}</span>
      </p>
      <form styleName="malibu-form" onSubmit={member.isPhoneLogin ? otpLogin : otpHandler}>
        <InputField name="Enter OTP" id="otp" type="text" required onChange={setData} />
        {error && <p styleName="error">Invalid OTP</p>}
        {successMsg && <p>{successMsg}</p>}
        <div styleName="actions">
          <button
            aria-label="verify-otp-button"
            onClick={member.isPhoneLogin ? otpLogin : otpHandler}
            className="malibu-btn-large"
          >
            Verify OTP
          </button>
          <button disabled={time > 0} className="malibu-btn-large" styleName="resend-otp-btn" onClick={resendOTP}>
            Resend OTP
          </button>
        </div>
        {time > 0 && (
          <p styleName="resend-otp">
            Resend OTP in <span>{`0.${time}`}</span>
          </p>
        )}
      </form>
    </React.Fragment>
  );
};

OTP.propTypes = {
  member: PT.object,
  customCallbackUrl: PT.string,
};

export { OTP };
