import { createContext, useReducer } from 'react';

import { type UserInfo } from '../model/login';
import { info } from '@tauri-apps/plugin-log';

import { Store } from '@tauri-apps/plugin-store';

export const UserContext = createContext<UserInfo | null>(null);
export const UserDispatchContext = createContext<React.Dispatch<{ type: string; payload?: UserInfo }>>(() => { });

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, dispatch] = useReducer(
        userReducer,
        initialUser
    );

    return (
        <UserContext.Provider value={user}>
            <UserDispatchContext.Provider value={dispatch}>
                {children}
            </UserDispatchContext.Provider>
        </UserContext.Provider>
    )
}

function userReducer(user: UserInfo | null, action: { type: string; payload?: UserInfo }): UserInfo | null {
    switch (action.type) {
        case "SET_USER":
            Store.load("user.bin").then(store => {
                info(`Setting user: ${action.payload?.name} (mid: ${action.payload?.mid})`);
                store.set("user", action.payload ?? null);
                info("Saving user to store");
            });
            return action.payload ?? null;
        case "CLEAR_USER":
            info("Clearing user");
            return null;
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}

const initialUser: UserInfo | null = null;