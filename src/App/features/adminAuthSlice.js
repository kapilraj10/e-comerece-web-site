import { createSlice } from "@reduxjs/toolkit";

const adminAuthSlice = createSlice({
    name: 'adminAuth',
    initialState: {
        isLogedIn: false,
        adminData: {},
        admins: []
    },
    reducers: {
        login: (state, action) => {
            const userInfo = action.payload;
            state.isLogedIn = true;
            state.adminData = userInfo;

            const existingAdmin = state.admins.find(admin => admin.email === userInfo.email);
            if (!existingAdmin) {
                state.admins.push(userInfo);
            }

            const { email, password } = userInfo;
            const loginData = { email, password };
            localStorage.setItem('adminAuthData', JSON.stringify(loginData));
        },

        notLogin: (state) => {
            state.isLogedIn = false;
            state.adminData = {};
        },

        logout: (state) => {
            localStorage.removeItem('adminAuthData');
            state.isLogedIn = false;
            state.adminData = {};
        },

        updateAdmin: (state, action) => {
            const { email, password } = action.payload;

            localStorage.setItem('adminAuthData', JSON.stringify({ email, password }));

            const adminIndex = state.admins.findIndex(admin => admin.email === email);
            if (adminIndex !== -1) {
                state.admins[adminIndex] = action.payload;
            }

            state.adminData = action.payload;
        },

        addAdmin: (state, action) => {
            const newAdmin = action.payload;
            state.admins.push(newAdmin);
        }
    }
});

export const { login, notLogin, logout, updateAdmin, addAdmin } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
