"use client";
import { FollowerModel, PodiumPassBuyerModel } from "app/services/api/types";
import { ReduxProvider } from "app/store/Provider";
import { Button } from "../Button";

const Content = () => {
  return (
    <Button variant="outline" size="sm">
      Follow
    </Button>
  );
};
export const FollowButton = ({
  user,
}: {
  user: FollowerModel | PodiumPassBuyerModel;
}) => {
  const { followed_by_me } = user;
  return (
    <ReduxProvider>
      <Content />
    </ReduxProvider>
  );
};
