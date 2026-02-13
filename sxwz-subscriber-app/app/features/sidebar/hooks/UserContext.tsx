import { createContext, useContext, useReducer } from 'react';

import { type UserInfo } from "../model/user-info"

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
            console.log("Setting user:", action.payload);
            return action.payload ?? null;
        case "CLEAR_USER":
            return null;
        default:
            throw new Error(`Unknown action type: ${action.type}`);
    }
}

const initialUser: UserInfo | null = null;