import React, { useState } from "react";
import { object } from "prop-types";

import "./profile-page.m.css";
import LinkProfile from "./LinkProfile";
import UpdatePassword from "./UpdatePassword";

const getFields = function (member, keys, setShowPasswordModal, setShowLinkModal) {
  const fields = keys.map((key, id) => {
    const label = key[0].toUpperCase().concat(key.slice(1));
    const renderField = (key) => {
      switch (key) {
        case "password":
          return (
            <span styleName={`link ${member.email ? "" : "link-disable"}`} onClick={() => setShowPasswordModal(true)}>
              Update Password
            </span>
          );
        case "email":
        case "login-phone-number":
          return member[key] ? (
            member[key]
          ) : (
            <span styleName="link" onClick={() => setShowLinkModal(true)}>{`Link ${label}`}</span>
          );
        default:
          return member[key];
      }
    };

    return (
      <p styleName="fields" key={id}>
        <b>{label}: </b>
        {renderField(key)}
      </p>
    );
  });

  return fields;
};

const ProfileCard = ({ member }) => {
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const keys = ["name", "email", "login-phone-number", "password"];

  return (
    <div styleName="fields-container">
      {getFields(member, keys, setShowPasswordModal, setShowLinkModal)}
      {showLinkModal && <LinkProfile onClose={() => setShowLinkModal(false)} member={member} />}
      {showPasswordModal && <UpdatePassword onClose={() => setShowPasswordModal(false)} member={member} />}
    </div>
  );
};

ProfileCard.propTypes = {
  member: object,
};

export { ProfileCard };
