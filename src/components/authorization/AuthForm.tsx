import {Button, Box, TextField} from "@mui/material";
import React, {useState} from "react";

interface AuthFormData {
    login: string,
    password: string
}
const initialAuthData: AuthFormData = {
  login: "",
  password: ""
};
export default function AuthForm() {
    const [authData,
        setAuthData] = useState(initialAuthData);

    function handleLoginChange(e: React.ChangeEvent<HTMLInputElement>) {
        setAuthData({
            ...authData,
            login: e.target.value
        });
    }
    function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
        setAuthData({
            ...authData,
            password: e.target.value
        });
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        //call action epic to send data to server
        console.log(authData);
        setAuthData(initialAuthData);
    }

    return (
        <div>
            <Box sx={
                {
                    color: 'secondary.main',
                    fontFamily: 'default',
                    fontSize: 20,
                    mb: 3
                }
            }>You need to sign in first</Box>
            <form onSubmit={handleSubmit}>
                <TextField
                    type="text"
                    variant='outlined'
                    color='secondary'
                    label="Login"
                    onChange={handleLoginChange}
                    value={authData.login}
                    fullWidth
                    required
                    sx={{mb: 4}}
                />
                <TextField
                    type="password"
                    variant='outlined'
                    color='secondary'
                    label="Password"
                    onChange={handlePasswordChange}
                    value={authData.password}
                    required
                    fullWidth
                    sx={{mb: 4}}
                />
                <Button
                    variant="outlined"
                    color="secondary"
                    type="submit"
                >
                    Sign in
                </Button>
            </form>
        </div>
    );
}