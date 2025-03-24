import {ReactNode} from "react";

export interface LoginButtonProps{
    title:string
    onLogin:(token: string) => void
    icon: ReactNode
}

export interface LoginGoogleRequest {
    token:string
}