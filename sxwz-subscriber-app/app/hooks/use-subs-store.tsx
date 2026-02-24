import { create } from 'zustand';

import { info } from '@tauri-apps/plugin-log';
import { Store } from '@tauri-apps/plugin-store';

import { type RoomInfo, type Sub } from '../features/subscriber/model/sub-info';

type SubsState = {
    subs: Sub[];
    setSubs: (subs: Sub[]) => void;
    saveSubs: () => void;
    clearSubs: () => void;
}

export const useSubsStore = create<SubsState>(
    (set) => ({
        subs: [],
        setSubs: (subs: Sub[]) => set({ subs }),
        saveSubs: () => {
            Store.load("subs.bin").then(store => {
                store.set("subs", useSubsStore.getState().subs);
                info("Saved subs to store");
            });
        },
        clearSubs: () => {
            set({ subs: [] });
            Store.load("subs.bin").then(store => {
                useSubsStore.getState().setSubs([]);
                store.set("subs", []);
                info("Cleared subs from store");
            });
        }

    })
);
