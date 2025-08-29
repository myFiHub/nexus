import { nameDialog, NameDialogResult } from "app/components/Dialog/nameDialog";
import podiumApi from "app/services/api";
import { User } from "app/services/api/types";

export function* detached_checkName({ user }: { user: User }) {
  let savedName = user?.name;
  if (!savedName || savedName.includes("@")) {
    const { confirmed, enteredText }: NameDialogResult = yield nameDialog();
    if (confirmed && (enteredText?.trim().length || 0) > 0) {
      const resultsForUpdate: User | undefined =
        yield podiumApi.updateMyUserData({ name: enteredText });
      if (resultsForUpdate) {
        savedName = enteredText;
      }
    }
  }
  return savedName;
}
