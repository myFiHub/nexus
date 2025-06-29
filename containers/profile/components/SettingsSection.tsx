"use client";

import { Switch } from "app/components/Switch";
import { GlobalSelectors } from "app/containers/global/selectors";
import { globalActions } from "app/containers/global/slice";
import { useDispatch, useSelector } from "react-redux";

export const SettingsSection = () => {
  const dispatch = useDispatch();
  const viewArchivedOutposts = useSelector(
    GlobalSelectors.viewArchivedOutposts
  );

  const handleToggleArchivedOutposts = (checked: boolean) => {
    dispatch(globalActions.setViewArchivedOutposts(checked));
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-foreground mb-4">Settings</h3>
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-medium text-foreground">
              Show Archived Outposts
            </h4>
            <p className="text-sm text-muted-foreground mt-1">
              Display archived outposts in your outposts list
            </p>
          </div>
          <Switch
            checked={viewArchivedOutposts}
            onCheckedChange={handleToggleArchivedOutposts}
          />
        </div>
      </div>
    </div>
  );
};
