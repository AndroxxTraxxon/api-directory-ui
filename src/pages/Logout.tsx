import React from "react";

import { useAuth } from "../context/Auth";


export default function LogoutPage(){
    const { logout } = useAuth();
    logout();
    return <></>;
}