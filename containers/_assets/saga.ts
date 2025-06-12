import { movementService } from "app/services/move/aptosMovement";
import { all, put, takeLatest } from "redux-saga/effects";
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
        gettingPrice: true,
        gettingOwnedNumber: true,
        price: "0",
        ownedNumber: 0,
        error: undefined,
        errorGettingPrice: undefined,
        errorGettingOwnedNumber: undefined,
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

    console.log({ price, ownedNumber });
    yield put(
      assetsActions.setUserPassInfo({
        address,
        pass: {
          price: price.toString(),
          ownedNumber: Number(ownedNumber),
          gettingPrice: false,
          gettingOwnedNumber: false,
          errorGettingPrice: undefined,
          errorGettingOwnedNumber: undefined,
        },
      })
    );
  } catch (error) {
    yield put(
      assetsActions.setUserPassInfo({
        address,
        pass: {
          gettingPrice: false,
          gettingOwnedNumber: false,
          price: "0",
          ownedNumber: 0,
          errorGettingPrice: "Error while getting Podium pass info",
        },
      })
    );
  }
}

export function* assetsSaga() {
  yield takeLatest(assetsActions.getBalance.type, getBalance);
  yield takeLatest(assetsActions.getUserPassInfo.type, getUserPassInfo);
}
