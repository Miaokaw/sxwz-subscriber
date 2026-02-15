import { createContext, useReducer } from 'react';

import type { UserInfoData } from '../model/login';

export const UserContext = createContext<UserInfoData | null>(null);
export const UserDispatchContext = createContext<React.Dispatch<{ type: string; payload?: UserInfoData }>>(() => { });

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

function userReducer(user: UserInfoData | null, action: { type: string; payload?: UserInfoData }): UserInfoData | null {
    switch (action.type) {
        case "SET_USER":
            console.log("Setting user:", action.payload);
            return action.payload ?? null;
        case "CLEAR_USER":
            return null;
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}

const initialUser: UserInfoData | null = null;