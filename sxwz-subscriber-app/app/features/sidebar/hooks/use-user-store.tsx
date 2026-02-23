import { create } from 'zustand';

import { info } from '@tauri-apps/plugin-log';
import { Store } from '@tauri-apps/plugin-store';

import { type UserInfo } from '../model/login';

type UserState = {
    user: UserInfo | null;
    setUser: (user: UserInfo) => void;
    clearUser: () => void;
}

export const useUserStore = create<UserState>(
    (set) => ({
        user: null,
        setUser: (user: UserInfo) => {
            set({ user });
            Store.load("user.bin").then(store => {
                info(`Setting user: ${user.name} (mid: ${user.mid})`);
                store.set("user", user);
                info("Saving user to store");
            });
        },
        clearUser: () => {
            info("Clearing user");
            set({ user: null });
            Store.load("user.bin").then(store => {
                store.set("user", null);
                info("Clearing user from store");
            });
        }
    })
);
