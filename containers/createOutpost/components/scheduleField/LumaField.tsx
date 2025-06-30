"use client";
import { lumaUserDialog, LumaUserDialogResult } from "app/components/Dialog";
import { motion } from "framer-motion";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../../../components/Button";
import { Switch } from "../../../../components/Switch";
import { createOutpostSelectors } from "../../selectors";
import { createOutpostActions } from "../../slice";

export const LumaField = () => {
  const dispatch = useDispatch();
  const enabledLuma = useSelector(createOutpostSelectors.enabledLuma);
  const hosts = useSelector(createOutpostSelectors.lumaHosts);
  const guests = useSelector(createOutpostSelectors.lumaGuests);

  const handleLumaChange = (value: boolean) => {
    dispatch(createOutpostActions.setEnabledLuma(value));
  };

  const handleAddHosts = async () => {
    const results: LumaUserDialogResult = await lumaUserDialog({
      title: "Enter the Hosts",
      initialUsers: hosts.map((host) => {
        return {
          name: host.name ?? "",
          email: host.email,
        };
      }),
    });
    if (results.users) {
      dispatch(createOutpostActions.setLumaHosts(results.users));
    }
  };

  const handleAddGuests = async () => {
    const results: LumaUserDialogResult = await lumaUserDialog({
      title: "Enter the Guests",
      initialUsers: guests.map((guest) => {
        return {
          name: guest.name ?? "",
          email: guest.email,
        };
      }),
    });
    if (results.users) {
      dispatch(createOutpostActions.setLumaGuests(results.users));
    }
  };

  return (
    <div className="w-full  ">
      {/* Luma Switch */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <Image
            src="/lumaPng.png"
            alt="Luma"
            width={20}
            height={20}
            className="rounded-sm"
          />
          <div
            className="relative cursor-pointer"
            onClick={() => handleLumaChange(!enabledLuma)}
          >
            <span className="text-sm font-medium text-foreground">
              Add Luma Event
            </span>
          </div>
        </div>
        <Switch checked={enabledLuma} onCheckedChange={handleLumaChange} />
      </div>

      {/* Animated Buttons Container */}
      <motion.div
        layout
        initial={false}
        animate={{
          height: enabledLuma ? "auto" : 0,
          opacity: enabledLuma ? 1 : 0,
        }}
        transition={{
          height: {
            duration: enabledLuma ? 0.3 : 0.1,
            ease: "easeOut",
          },
          opacity: {
            duration: enabledLuma ? 0.2 : 0,
            ease: "easeOut",
            delay: enabledLuma ? 0.3 : 0,
          },
        }}
        style={{ overflow: "hidden" }}
      >
        <div className="flex gap-2 mt-3">
          <Button
            onClick={handleAddHosts}
            variant="outline"
            className="flex-1 flex gap-0.5"
          >
            {hosts.length == 0 ? (
              <>
                <span>Add Hosts </span>
                <span className="text-xs text-red-400"> (required)</span>
              </>
            ) : (
              <span>{hosts.length} hosts </span>
            )}
          </Button>
          <Button
            onClick={handleAddGuests}
            variant="outline"
            className="flex-1"
          >
            {guests.length == 0 ? (
              <>
                <span>Add Guests </span>
              </>
            ) : (
              <span>{guests.length} Guests </span>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
