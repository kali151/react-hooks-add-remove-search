import React, { useState } from 'react';

export const AuthContext = React.createContext({
    isAuthenticated: false,
    login: () => { }
});

const AuthContextProvider = props => {
    const [isAuthenticated, setIsAuth] = useState(false);

    const loginHandler = () => {
        setIsAuth(true);
    }

    return (
        <AuthContext.Provider value={{ login: loginHandler, isAuthenticated: isAuthenticated }}>
            {props.children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider;