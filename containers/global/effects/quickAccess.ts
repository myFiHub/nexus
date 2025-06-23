import { getStore } from "app/store";

export class EasyAccess {
  private static instance: EasyAccess;

  private constructor() {}

  static getInstance(): EasyAccess {
    if (!EasyAccess.instance) {
      EasyAccess.instance = new EasyAccess();
    }
    return EasyAccess.instance;
  }

  get myUser() {
    const user = getStore().getState().global.podiumUserInfo!;
    return user;
  }
}

export const easyAccess = EasyAccess.getInstance();
