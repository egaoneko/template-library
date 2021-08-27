import { makeAutoObservable } from "mobx";

class UserStore {
  constructor() {
    makeAutoObservable(this);
  }
}

export default UserStore;
