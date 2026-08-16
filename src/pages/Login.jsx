import { signIn } from '../data/authService'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

export default function Login(){

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const navigate = useNavigate(); 

    async function handleSubmit(e){
        e.preventDefault(); //verhindert das Standard-Browser-Verhalten (Seite neu laden), damit React die Sache direkt übernimmt
        setError (null); 
        try{
            await signIn(email, password);
            navigate('/');
        } catch (error) {
            setError("Login unsuccessful. Try again.")
        }
    }

    return(
        <div className='login-page'>
            <div className='login-content-container'>
                <h1 className='login-header'>Ready to Bounce?</h1>
                
                    <p>Sign In</p>
                    <form onSubmit={handleSubmit}>
                        <input 
                        type = 'email' 
                        placeholder = 'E-Mail'
                        onChange={(e) => setEmail(e.target.value.trim())}
                        />
                        <input 
                        type = 'password'
                        placeholder ='Password'
                        onChange={(e) => setPassword(e.target.value)}
                        />
                        <button className='enter-button' type='submit'>Enter</button>
                    </form>
                    {error && <p className="error-message">{error}</p>} {/* Bedingte Anzeige der Fehlermeldung */}
                    {/* Falls error ein Wert ist, der nicht false/null/undefined ist (echter Fehlertext), dann wird das gerendert, 
                    was rechts steht. Falls error = null -> nichts wird gerendert.*/}
            
                <div className='register-container'>
                    <p>Don't have an account yet?</p>
                    <Link to='/register' className='register-link'>Register</Link>
                </div>
            </div>
        </div>
    )
}