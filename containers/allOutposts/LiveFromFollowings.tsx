"use client";

import { LiveDot, Rail, RailItem, SectionHeader } from "app/components/aurora";
import { GlobalSelectors } from "app/containers/global/selectors";
import { LiveCard, presenceLine } from "app/containers/home/cards";
import { useVisiblePolling } from "app/lib/useVisiblePolling";
import podiumApi from "app/services/api";
import { DiscoveredOutpost } from "app/services/api/types";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const POLL_MS = 60_000;

export const LiveFromFollowings = () => {
  const userId = useSelector(GlobalSelectors.podiumUserInfo)?.uuid;
  const [items, setItems] = useState<DiscoveredOutpost[]>([]);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    podiumApi.getLiveFromFollowings(12).then((result) => active && setItems(result));
    return () => {
      active = false;
    };
  }, [userId]);

  useVisiblePolling(
    () => podiumApi.getLiveFromFollowings(12).then(setItems),
    POLL_MS,
    !!userId
  );

  if (!userId || items.length === 0) return null;
  return (
    <section>
      <SectionHeader
        title="Live from people you follow"
        count={items.length}
        trailing={<LiveDot />}
      />
      <Rail label="Live from people you follow">
        {items.map((item, i) => (
          <RailItem key={item.uuid} index={i}>
            <LiveCard
              outpost={item}
              online={item.online_users_count ?? 0}
              line={presenceLine(item)}
              people={item.followed_users_in_room}
            />
          </RailItem>
        ))}
      </Rail>
    </section>
  );
};
