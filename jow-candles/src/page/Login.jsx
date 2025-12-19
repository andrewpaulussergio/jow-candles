import { useState } from 'react'
import { supabase } from '../supabaseClient'
import './Login.css';


function Login({ setToken }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            })
            if (error) throw error
            setToken(data)
        } catch (error) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-container" style={{backgroundImage: "url(/assets/images/jow-candles/misc/index-products-bg-large.png)"}}>
            <div className="login-card">
                <div className="login-header">
                    <img src="/assets/images/jow-candles/misc/jow-candles-logo.png" alt="JOW Candles Logo" className="logo"/>
                    <h1>Welcome Back <span className="wave">👋🏻</span></h1>
                    <p>Manage your beautiful candle inventory.</p>
                </div>

                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login