"use client";

import { User } from "app/services/api/types";
import { AnimatePresence, motion } from "framer-motion";
import { CohostItem } from "./CohostItem";
import { CohostsEmptyState } from "./CohostsEmptyState";
import { useDispatch, useSelector } from "react-redux";
import { createOutpostSelectors } from "../../selectors";
import { createOutpostActions } from "../../slice";

export const CohostsList = () => {
  const dispatch = useDispatch();
  const cohostUsers = useSelector(createOutpostSelectors.cohostUsers) || [];
  const onRemove = (uuid: string) => {
    const user = cohostUsers.find((u) => u.uuid === uuid);
    if (user) {
      dispatch(createOutpostActions.toggleCohostUser(user));
    }
  };
  return (
    <motion.div className="space-y-2 pt-1" layout>
      <AnimatePresence mode="popLayout">
        {cohostUsers.length > 0 ? (
          cohostUsers.map((user) => (
            <CohostItem key={user.uuid} user={user} onRemove={onRemove} />
          ))
        ) : (
          <CohostsEmptyState />
        )}
      </AnimatePresence>
    </motion.div>
  );
};
