import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  name: string;
  _id: string;
  phone: string;
  isAdmin: boolean;
  wallet?: {
    balance: number;
    _id: string;
    updatedAt: Date;
  };
  invested?: number;
  returnAmount?: number;
  investedDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  isLogined: boolean;
}

const initialState: UserState = {
  name: "",
  _id: "",
  phone: "",
  isAdmin: false,
  isLogined: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(_, action: PayloadAction<setUserPayload>) {
      return {
        name: action.payload.name,
        _id: action.payload._id,
        phone: action.payload.phone,
        wallet: action.payload.wallet,
        invested: action.payload.invested,
        returnAmount: action.payload.returnAmount,
        investedDate: action.payload.investedDate,
        createdAt: action.payload.createdAt,
        updatedAt: action.payload.updatedAt,
        isAdmin: false,
        isLogined: true,
      };
    },
    setAdmin(state, action: PayloadAction<setAdminPayload>) {
      state.name = action.payload.name;
      state._id = action.payload._id;
      state.phone = action.payload.phone;
      state.isAdmin = true;
      state.isLogined = true;
      state.wallet = undefined;
    },
    clearUser() {
      return initialState;
    },
    updateWallet(state, action: PayloadAction<updateWalletPayload>) {
      if (state.wallet) {
        state.wallet.balance = action.payload.balance;
        state.wallet.updatedAt = action.payload.updatedAt;
      }
    },
  },
});

export const { setUser, setAdmin, clearUser, updateWallet } = userSlice.actions;
export default userSlice.reducer;

//* interface
interface setUserPayload {
  name: string;
  _id: string;
  phone: string;
  wallet: {
    balance: number;
    _id: string;
    transactions: string[];
    updatedAt: Date;
  };
  invested: number;
  returnAmount: number;
  investedDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface updateWalletPayload {
  balance: number;
  updatedAt: Date;
}

interface setAdminPayload {
  name: string;
  _id: string;
  phone: string;
}
