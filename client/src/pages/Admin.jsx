import React, { useState } from 'react';
import Login from '../components/admin/Login';
import Dashboard from '../components/admin/Dashboard';

const Admin = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    if (!token) {
        return <Login setToken={setToken} />;
    }

    return <Dashboard token={token} setToken={setToken} />;
};

export default Admin;
