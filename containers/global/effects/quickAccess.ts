import { User } from "app/services/api/types";
import { select } from "redux-saga/effects";
import { GlobalDomains } from "../selectors";

export class EasyAccess {
  static *myUser(): Generator<any, User, any> {
    const user: User = yield select(GlobalDomains.podiumUserInfo);
    if (!user) {
      throw new Error("User not found - user must be logged in");
    }
    return user;
  }
}
