import type { Store } from "@/src/types/Store";
import { FullUser } from "@/src/types/User";
import { trpcClient } from "@/src/utils/trpc";
import { makeAutoObservable } from "mobx";

export class UserStore {
  private _lastAuthenticatedUsername = "";
  get lastAuthenticatedUsername(): string {
    return this._lastAuthenticatedUsername;
  }
  set lastAuthenticatedUsername(value: string) {
    this._lastAuthenticatedUsername = value;
    localStorage.setItem("lastAuthenticatedUsername", value);
  }

  private _me: FullUser | null = null;
  get me() {
    return this._me;
  }
  set me(value: FullUser | null) {
    this._me = value;
    if (value) this.lastAuthenticatedUsername = value.username;
  }

  get isAuthenticated() {
    return !!this.me;
  }

  get username(): string {
    return this.me?.username ?? "";
  }

  constructor(readonly store: Store) {
    makeAutoObservable(this);
  }

  initialize = async () => {
    this._lastAuthenticatedUsername =
      localStorage.getItem("lastAuthenticatedUsername") || "";

    if (this._lastAuthenticatedUsername)
      this.me = (await this.fetchUser(this._lastAuthenticatedUsername)) ?? null;

    if (!this.me) {
      this.lastAuthenticatedUsername = "";
      this.store.uiStore.showingUserPickerModal = true;
    }
  };

  fetchUser = async (username: string) => {
    return await trpcClient.user.getUser.query({
      username,
      usingLocalData: this.store.usingLocalData,
    });
  };
}
