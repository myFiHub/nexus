import { InviteUsersButton } from "app/containers/outpostDetails/components/InviteUsersButton";
import { GripVertical } from "lucide-react";
import { memo, useRef } from "react";
import Draggable from "react-draggable";
import { useSelector } from "react-redux";
import { onGoingOutpostSelectors } from "../../selectors";
import { BackupFetcher } from "./backupFetcher";
import { MembersHeader } from "./header";
import { MembersList } from "./list";

export const OngoingOutpostMembers = memo(
  () => {
    const outpost = useSelector(onGoingOutpostSelectors.outpost);
    const nodeRef = useRef(null);

    // Show loading state when getting live members
    return (
      <>
        {outpost && <BackupFetcher outpost={outpost} />}
        <Draggable
          nodeRef={nodeRef}
          handle=".drag-handle"
          defaultPosition={{ x: 0, y: 0 }}
          bounds="parent"
        >
          <div
            ref={nodeRef}
            className="absolute top-0 pt-4 right-0 bg-card/95 backdrop-blur-sm border border-border rounded-lg shadow-lg max-w-[360px] w-[360px] max-h-[calc(100%-32px)] overflow-hidden z-50"
          >
            {/* Drag Handle */}
            <div className="drag-handle absolute top-0 left-0 w-full h-6 bg-muted/80 hover:bg-muted border border-border rounded cursor-move flex items-center justify-center group z-10">
              <GripVertical className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between gap-2 mb-3">
                <MembersHeader />
                {outpost && (
                  <InviteUsersButton
                    outpost={outpost}
                    withWrapper={false}
                    buttonSize="xxs"
                  />
                )}
              </div>
              <div className="overflow-y-auto max-h-[calc(100%-60px)]">
                <MembersList />
              </div>
            </div>
          </div>
        </Draggable>
      </>
    );
  },

  () => true
);
