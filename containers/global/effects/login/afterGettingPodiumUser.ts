import { assetsActions, useAssetsSlice } from "app/containers/_assets/slice";
import {
  myOutpostsActions,
  useMyOutpostsSlice,
} from "app/containers/myOutposts/slice";
import {
  notificationsActions,
  useNotificationsSlice,
} from "app/containers/notifications/slice";
import { profileActions, useProfileSlice } from "app/containers/profile/slice";
import { User } from "app/services/api/types";
import { detached_checkName } from "./check_name";
import { globalActions } from "../../slice";
import { all, put } from "redux-saga/effects";
import { CookieKeys } from "app/lib/client-cookies";
import { setServerCookieViaAPI } from "app/lib/client-server-cookies";
import { wsClient } from "app/services/wsClient";

export function* detached_afterGettingPodiumUser({
  user,
  token,
  savedName,
}: {
  user: User;
  token: string;
  savedName: string;
}) {
  useMyOutpostsSlice();
  useProfileSlice();
  useAssetsSlice();
  useNotificationsSlice();
  const remoteName: string = yield detached_checkName({
    user: { ...user, name: savedName },
  });
  if (!remoteName) {
    yield put(globalActions.logout());
    return;
  }
  yield put(
    globalActions.setPodiumUserInfo({
      ...user,
      name: remoteName,
    })
  );

  yield put(globalActions.initOneSignal({ myId: user.uuid }));
  yield all([
    put(notificationsActions.getNotifications()),
    put(assetsActions.getMyBlockchainPasses()),
    put(assetsActions.getBalance()),
    put(myOutpostsActions.getOutposts()),
    put(profileActions.fetchNfts({ silent: true })),
    put(assetsActions.getPassesBoughtByMe({ page: 0 })),
    setServerCookieViaAPI(CookieKeys.myUserId, user.uuid),
    setServerCookieViaAPI(CookieKeys.myMoveAddress, user.aptos_address!),
    wsClient.connect(token, process.env.NEXT_PUBLIC_WEBSOCKET_ADDRESS!),
  ]);
}
