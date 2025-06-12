import { toast } from "app/lib/toast";
import podiumApi from "app/services/api";
import { User } from "app/services/api/types";
import { movementService } from "app/services/move/aptosMovement";
import { getStore } from "app/store";
import { all, put, select, takeLatest } from "redux-saga/effects";
import { GlobalSelectors } from "../global/selectors";
import { AssetsSelectors } from "./selectore";
import { assetsActions } from "./slice";

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
  yield put(
    assetsActions.setUserPassInfo({
      address,
      pass: {
        loading: true,
        price: "0",
        ownedNumber: 0,
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
          price: "0",
          ownedNumber: 0,
          error: "Error, retry getting the Pass Info?",
        },
      })
    );
  }
}

function* buyPass(
  action: ReturnType<typeof assetsActions.buyPass>
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
          getStore().dispatch(assetsActions.buyPass({ user, numberOfTickets }));
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

    const response =
      yield movementService.buyTicketFromTicketSellerOnPodiumPass({
        referrer: referrerAddress,
        numberOfTickets,
        sellerAddress: user.aptos_address!,
        sellerName: user.name ?? "",
        sellerUuid: user.uuid,
      });
    if (response) {
      const success = response[0];
      const error = response[1];
      if (success) {
        yield put(
          assetsActions.getUserPassInfo({ address: user.aptos_address! })
        );
        toast.success("Pass bought successfully");
        yield getUserPassInfo({
          payload: { address: user.aptos_address! },
          type: assetsActions.getUserPassInfo.type,
        });
      }
      if (error) {
        toast.error(error);
      }
    } else {
      errorToaset();
    }
  } catch (error) {
    errorToaset();
  } finally {
    const currentPassInfo = yield select(
      AssetsSelectors.userPasses(user.aptos_address!)
    );
    yield put(
      assetsActions.setUserPassInfo({
        address: user.aptos_address!,
        pass: {
          loading: false,
          price: currentPassInfo?.price ?? "0",
          ownedNumber: currentPassInfo?.ownedNumber ?? 0,
          error: undefined,
        },
      })
    );
  }
}

export function* assetsSaga() {
  yield takeLatest(assetsActions.getBalance.type, getBalance);
  yield takeLatest(assetsActions.getUserPassInfo.type, getUserPassInfo);
  yield takeLatest(assetsActions.buyPass.type, buyPass);
}
