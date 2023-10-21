import React, { useState } from "react";
import { useSelector } from "react-redux";
import get from "lodash/get";
import { AccessType } from "@quintype/components";
import { ProfilePageWithAccesstype } from "./ProfilePageWithAccesstype";

import "./profile-page.m.css";

const ProfilePage = () => {
  const [isATGlobal, setIsATGlobal] = useState(false);
  const member = useSelector((state) => get(state, ["member"], null));
  const email = get(member, ["email"], "");
  const phone = get(member, ["metadata", "phone-number"], "");
  const { key, accessTypeBkIntegrationId } = useSelector((state) =>
    get(state, ["qt", "config", "publisher-attributes", "accesstypeConfig"], {})
  );

  return (
    <AccessType
      enableAccesstype={true}
      accessTypeKey={key}
      email={email}
      phone={phone}
      accessTypeBkIntegrationId={accessTypeBkIntegrationId}
      onATGlobalSet={() => {
        setIsATGlobal(true);
      }}
    >
      {({ initAccessType, getSubscriptionForUser, cancelSubscription }) => (
        <ProfilePageWithAccesstype
          member={member}
          getSubscriptionForUser={getSubscriptionForUser}
          cancelSubscription={cancelSubscription}
          isATGlobal={isATGlobal}
          initAccessType={initAccessType}
        />
      )}
    </AccessType>
  );
};

export { ProfilePage };
