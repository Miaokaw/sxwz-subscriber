import { create } from 'zustand';

import { info } from '@tauri-apps/plugin-log';
import { Store } from '@tauri-apps/plugin-store';

import { type UserInfo } from '../features/sidebar/model/login';
import { invoke } from '@tauri-apps/api/core';

type UserState = {
    user: UserInfo | null;
    SESSDATA: string | null;
    setUser: (user: UserInfo) => void;
    clearUser: () => void;
    loadCookie: () => void;
    saveCookie: (sessData: string) => void;
    deleteCookie: () => void;
}

export const useUserStore = create<UserState>(
    (set) => ({
        user: null,
        SESSDATA: null,
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
        },
        loadCookie: () => {
            info("Loading cookie");
            invoke("get_sess_data").then((sessData) => {
                set({ SESSDATA: sessData as string });
            });
        },
        saveCookie: (sessData: string) => {
            info("Saving cookie");
            invoke("save_sess_data", { sessData });
            set({ SESSDATA: sessData });
        },
        deleteCookie: () => {
            info("Deleting cookie");
            invoke("delete_sess_data");
            set({ SESSDATA: null });
        }
    })
);
