import {
  CallObject,
  CallObjectResponse,
  promiseWithUid,
} from "app/lib/promiseWithUid";
import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import {
  OutpostModel,
  PodiumPassBuyerModel,
  User,
} from "app/services/api/types";
import { movementService } from "app/services/move/aptosMovement";
import { getStore } from "app/store";
import { all, put, select, takeLatest } from "redux-saga/effects";
import { OutpostAccesses } from "../global/effects/types";
import { GlobalSelectors } from "../global/selectors";
import { revalidateUserProfile } from "../userDetails/serverActions/revalidateUser";
import { openOutpostPassCheckDialog } from "./outpostAccessesDialog";
import { AssetsSelectors } from "./selectore";
import { assetsActions, PassSeller } from "./slice";

function* getBalance() {
  yield put(assetsActions.setBalance({ value: "100", loading: true }));
  try {
    const balance: bigint = yield movementService.balance();
    const balanceString = balance.toString();
    yield put(
      assetsActions.setBalance({
        value: balanceString,
        loading: false,
        error: undefined,
      })
    );
  } catch (error) {
    yield put(
      assetsActions.setBalance({
        value: "0",
        loading: false,
        error: "Failed to get balance",
      })
    );
  }
}

function* getUserPassInfo(
  action: ReturnType<typeof assetsActions.getUserPassInfo>
): Generator<any, void, any> {
  const { address } = action.payload;
  const currentPassInfo = yield select(AssetsSelectors.userPasses(address));
  yield put(
    assetsActions.setUserPassInfo({
      address,
      pass: {
        loading: true,
        price: currentPassInfo?.price ?? "0",
        ownedNumber: currentPassInfo?.ownedNumber ?? 0,
        error: undefined,
      },
    })
  );
  try {
    const [ownedNumber, price] = yield all([
      movementService.getMyBalanceOnPodiumPass({
        sellerAddress: address,
      }),
      movementService.getTicketPriceForPodiumPass({
        sellerAddress: address,
        numberOfTickets: 1,
      }),
    ]);

    yield put(
      assetsActions.setUserPassInfo({
        address,
        pass: {
          price: price.toString(),
          ownedNumber: Number(ownedNumber),
          loading: false,
          error: undefined,
        },
      })
    );
  } catch (error) {
    yield put(
      assetsActions.setUserPassInfo({
        address,
        pass: {
          loading: false,
          price: currentPassInfo?.price ?? "0",
          ownedNumber: currentPassInfo?.ownedNumber ?? 0,
          error: "Error, retry getting the Pass Info?",
        },
      })
    );
  }
}

function* buyPassFromUser(
  action: ReturnType<typeof assetsActions.buyPassFromUser>
): Generator<any, void, any> {
  const { user, numberOfTickets } = action.payload;
  const correntPassInfo = yield select(
    AssetsSelectors.userPasses(user.aptos_address!)
  );

  const errorToaset = () => {
    toast.error(`Error,  "retry buying the Pass?"}`, {
      action: {
        label: "Retry",
        onClick: () => {
          getStore().dispatch(
            assetsActions.buyPassFromUser({ user, numberOfTickets })
          );
        },
      },
    });
  };

  yield put(
    assetsActions.setUserPassInfo({
      address: user.aptos_address!,
      pass: {
        loading: true,
        price: correntPassInfo?.price ?? "0",
        ownedNumber: correntPassInfo?.ownedNumber ?? 0,
        error: undefined,
      },
    })
  );

  try {
    const myUser: User = yield select(GlobalSelectors.podiumUserInfo);
    const myReferrer = myUser?.referrer_user_uuid;
    const fihubAddress = process.env.NEXT_PUBLIC_FIHUB_ADDRESS;
    let referrerAddress = fihubAddress;
    const callArray: any = [
      movementService.balance(),
      movementService.getTicketPriceForPodiumPass({
        sellerAddress: user.aptos_address!,
        numberOfTickets,
      }),
    ];
    if (myReferrer) {
      callArray.push(podiumApi.getUserData(myReferrer));
    }

    const [myBalance, price, referrerUser] = yield all(callArray);
    if (referrerUser) {
      referrerAddress = referrerUser.address;
    }

    if (myBalance < Number(correntPassInfo?.price) * numberOfTickets) {
      toast.error(
        `Insufficient balance, you need ${price} MOVE to buy ${numberOfTickets} Pass`
      );

      return;
    }

    const response = yield movementService.buyPodiumPassFromUser({
      referrer: referrerAddress,
      numberOfTickets,
      sellerAddress: user.aptos_address!,
      sellerName: user.name ?? "",
      sellerUuid: user.uuid,
    });
    if (response) {
      const success = response[0];
      const errorOrHash = response[1];
      if (success) {
        yield podiumApi.buySellPodiumPass({
          count: numberOfTickets,
          podium_pass_owner_address: user.address!,
          podium_pass_owner_uuid: user.uuid,
          trade_type: "buy",
          tx_hash: errorOrHash,
        });
        toast.success("Pass bought successfully");
        revalidateUserProfile(user.uuid);
      } else if (errorOrHash) {
        toast.error(errorOrHash);
      }
    } else {
      errorToaset();
    }
  } catch (error) {
    errorToaset();
  } finally {
    yield put(assetsActions.getUserPassInfo({ address: user.aptos_address! }));
  }
}

function* getPassesBoughtByMe(
  action: ReturnType<typeof assetsActions.getPassesBoughtByMe>
): Generator<any, void, any> {
  const { page } = action.payload;
  yield put(assetsActions.setIsGettingMyPasses(true));
  const myUser: User | undefined = yield select(GlobalSelectors.podiumUserInfo);
  const correntPassesList: {
    loading: boolean;
    passes: PodiumPassBuyerModel[];
  } = yield select(AssetsSelectors.passesListBoughtByMe);
  try {
    if (correntPassesList.loading) {
      return;
    }
    yield put(assetsActions.setPassesListBoughtByMeLoading(true));
    if (!myUser) {
      console.error("user is being read before login is complete");
      return;
    }
    const response: PodiumPassBuyerModel[] = yield podiumApi.myPodiumPasses({
      page: page,
      page_size: 100,
    });
    yield put(assetsActions.setPassesListBoughtByMe({ passes: response }));
  } catch (error) {
    yield put(
      assetsActions.setPassesListBoughtByMeError(
        "Error, while getting the Passes List. Please try again."
      )
    );
  } finally {
    yield put(assetsActions.setPassesListBoughtByMeLoading(false));
  }
}

function* sellOneOfMyBoughtPasses(
  action: ReturnType<typeof assetsActions.sellOneOfMyBoughtPasses>
): Generator<any, void, any> {
  const { pass } = action.payload;
  console.log("pass", pass);
}

export function* detached_checkPass({
  outpost,
}: {
  outpost: OutpostModel;
}): Generator<any, OutpostAccesses | undefined, any> {
  yield put(
    assetsActions.getOutpostPassSellers({
      outpost,
    })
  );
  const results = yield openOutpostPassCheckDialog({ outpost });
  console.log({ results });
  return {
    canEnter: false,
    canSpeak: false,
  };
}

function* getOutpostPassSellers(
  action: ReturnType<typeof assetsActions.getOutpostPassSellers>
): Generator<any, void, any> {
  const { outpost } = action.payload;
  try {
    yield put(
      assetsActions.setIsGettingOutpostPassSellers({
        outpostId: outpost.uuid,
        loading: true,
      })
    );
    const rawPassSellerIdsToBuyFromInOrderToHaveAccess: string[] =
      outpost.tickets_to_enter
        ?.map((ticket) => ticket.user_uuid)
        .filter((id): id is string => id !== undefined) ?? [];
    const rawPassSellerIdsToBuyFromInOrderToSpeak: string[] =
      outpost.tickets_to_speak
        ?.map((ticket) => ticket.user_uuid)
        .filter((id): id is string => id !== undefined) ?? [];
    const commonPassSellersBetweenSpeakAndEnter: string[] =
      rawPassSellerIdsToBuyFromInOrderToHaveAccess?.filter((id) =>
        rawPassSellerIdsToBuyFromInOrderToSpeak?.includes(id)
      ) ?? [];
    const passSellerIdsToBuyFromInOrderToHaveAccess: string[] =
      rawPassSellerIdsToBuyFromInOrderToHaveAccess?.filter(
        (id) => !commonPassSellersBetweenSpeakAndEnter?.includes(id)
      ) ?? [];
    const passSellerIdsToBuyFromInOrderToSpeak: string[] =
      rawPassSellerIdsToBuyFromInOrderToSpeak?.filter(
        (id) => !commonPassSellersBetweenSpeakAndEnter?.includes(id)
      ) ?? [];

    // Get all unique user IDs
    const allUserIds = [
      ...commonPassSellersBetweenSpeakAndEnter,
      ...passSellerIdsToBuyFromInOrderToHaveAccess,
      ...passSellerIdsToBuyFromInOrderToSpeak,
    ];

    // Fetch user data for all IDs
    const userDataPromises = allUserIds.map((id) => podiumApi.getUserData(id));
    const userDataResults: User[] = yield all(userDataPromises);
    console.log({ userDataResults });
    // Create a map for quick lookup
    const userDataMap = new Map<string, User>();
    userDataResults.forEach((user) => {
      if (user && user.uuid) {
        userDataMap.set(user.uuid, user);
      }
    });

    // Construct PassSeller objects
    const passSellers: PassSeller[] = [];

    // Add common pass sellers (enter and speak)
    commonPassSellersBetweenSpeakAndEnter.forEach((userId) => {
      const user = userDataMap.get(userId);
      if (user) {
        passSellers.push({
          uuid: user.uuid,
          name: user.name || "Unknown User",
          image: user.image || "",
          aptos_address: user.aptos_address || "",
          accessIfIBuy: "enterAndSpeak",
          price: "0", // This should be fetched from the movement service
          buying: false,
          bought: false,
          userInfo: user,
        });
      }
    });

    // Add enter-only pass sellers
    passSellerIdsToBuyFromInOrderToHaveAccess.forEach((userId) => {
      const user = userDataMap.get(userId);
      if (user) {
        passSellers.push({
          uuid: user.uuid,
          name: user.name || "Unknown User",
          image: user.image || "",
          aptos_address: user.aptos_address || "",
          accessIfIBuy: "enter",
          price: "0", // This should be fetched from the movement service
          buying: false,
          bought: false,
          userInfo: user,
        });
      }
    });

    // Add speak-only pass sellers
    passSellerIdsToBuyFromInOrderToSpeak.forEach((userId) => {
      const user = userDataMap.get(userId);
      if (user) {
        passSellers.push({
          uuid: user.uuid,
          name: user.name || "Unknown User",
          image: user.image || "",
          aptos_address: user.aptos_address || "",
          accessIfIBuy: "speak",
          price: "0", // This should be fetched from the movement service
          buying: false,
          bought: false,
          userInfo: user,
        });
      }
    });

    const numberOfOwnedPassesByMeObjectToCall: CallObject<bigint | null>[] = [];
    const priceObjectToCall: CallObject<number | null>[] = [];
    passSellers.forEach((seller) => {
      numberOfOwnedPassesByMeObjectToCall.push({
        uid: seller.uuid,
        toCall: () =>
          movementService.getMyBalanceOnPodiumPass({
            sellerAddress: seller.aptos_address,
          }),
      });
      priceObjectToCall.push({
        uid: seller.uuid,
        toCall: () =>
          movementService.getTicketPriceForPodiumPass({
            sellerAddress: seller.aptos_address,
            numberOfTickets: 1,
          }),
      });
    });

    const [ownedResults, priceResults]: [
      CallObjectResponse<bigint | null>,
      CallObjectResponse<number | null>
    ] = yield all([
      promiseWithUid(numberOfOwnedPassesByMeObjectToCall),
      promiseWithUid(priceObjectToCall),
    ]);

    passSellers.forEach((seller) => {
      const numberOfOwnedPasses = ownedResults[seller.uuid]?.response;
      const price = priceResults[seller.uuid]?.response;
      seller.price = price?.toString() ?? "0";
      seller.bought = numberOfOwnedPasses
        ? Number(numberOfOwnedPasses) > 0
        : false;
    });

    console.log({ ownedResults, priceResults, passSellers });

    yield put(
      assetsActions.setOutpostPassSellers({
        outpost,
        passes: passSellers,
      })
    );
  } catch (error) {
    yield put(
      assetsActions.setOutpostPassSellersError({
        outpostId: outpost.uuid,
        error: "Error, while getting the Passes List. Please try again.",
      })
    );
  } finally {
    yield put(
      assetsActions.setIsGettingOutpostPassSellers({
        outpostId: outpost.uuid,
        loading: false,
      })
    );
  }
}

export function* assetsSaga() {
  yield takeLatest(assetsActions.getBalance.type, getBalance);
  yield takeLatest(assetsActions.getUserPassInfo.type, getUserPassInfo);
  yield takeLatest(assetsActions.buyPassFromUser.type, buyPassFromUser);
  yield takeLatest(assetsActions.getPassesBoughtByMe.type, getPassesBoughtByMe);
  yield takeLatest(
    assetsActions.sellOneOfMyBoughtPasses.type,
    sellOneOfMyBoughtPasses
  );
  yield takeLatest(
    assetsActions.setPassesListBoughtByMePage.type,
    getPassesBoughtByMe
  );
  yield takeLatest(
    assetsActions.getOutpostPassSellers.type,
    getOutpostPassSellers
  );
}
