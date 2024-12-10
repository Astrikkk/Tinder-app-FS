import React, { useState, FormEvent } from 'react';
import axios from 'axios';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [authToken, setAuthToken] = useState<string>('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      setAuthToken(response.data.token);
      setMessage('Login successful!');
      localStorage.setItem('token', response.data.token);
    } catch (error) {
      setMessage('Login failed!');
    }
  };

  return (
      <div className="w-full max-w-md mx-auto p-5 border rounded">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        {message && <p>{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block">Email</label>
            <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block">Password</label>
            <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border rounded"
                required
            />
          </div>
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">Login</button>
        </form>
      </div>
  );
};

export default Login;
