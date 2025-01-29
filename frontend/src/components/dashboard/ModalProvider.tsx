"use server";
import { checkSubscription } from "@/lib/checkSubscription";
import React from "react";
import { SubscriptionModal } from "./SubscriptionModal";

const ModalProvider = async () => {
  const hasSubscription = await checkSubscription();

  return (
    <div>
        {hasSubscription ? null : <SubscriptionModal isOpen={true} />}
    </div>
  );
};

export default ModalProvider;
