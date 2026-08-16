import { Link, useNavigate } from 'react-router-dom'
import { signUp } from '../data/authService'
import { useState } from 'react'
import  './Register.css'

export default function Register(){

    const [email, setEmail] = useState(''); 
    const [password, setPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [error, setError] = useState(null)

    const navigate = useNavigate(); 

    async function handleSubmit(e){
        e.preventDefault()
         if (comparePasswords(password, confirmPassword)){
            try{
                await signUp(email, password);
                navigate('/');
            } catch (error) {
                 if (error.code === 'user_already_exists') {
                    setError('This e-mail already has an account.');
                } else if (error.code === 'weak_password') {
                    setError('Password should be at least 6 characters.');
                } else if (error.code === 'email_address_invalid'){
                    setError('Please enter a valid e-mail address.')
                } else {
                    setError('Registration unsuccessful. Try again.');
                }
            }
        } else {
            setError('Passwords are different. Try again.')
         }
    }

    function comparePasswords(pw1,pw2){
        return pw1===pw2;
    }

    return(
        <>
        <div className='register-page'>
        <div className='register-content-container'>
            <h1 className='register-header'>Join the Crew!</h1>
            
                <p>Sign Up</p>
                <form onSubmit={handleSubmit}>
                    <input 
                    type = 'email' 
                    placeholder = 'E-Mail'
                    onChange={(e) => setEmail(e.target.value.trim())}
                    />
                    <input 
                    type = 'password'
                    placeholder ='Enter your password'
                    onChange={(e) => setPassword(e.target.value)}
                    />
                    <input 
                    type = 'password'
                    placeholder ='Enter password again'
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button className='enter-button' type='submit'>Enter</button>
                </form>
                {error && <p className="error-message">{error}</p>} {/* Bedingte Anzeige der Fehlermeldung */}
                {/* Falls error ein Wert ist, der nicht false/null/undefined ist (echter Fehlertext), dann wird das gerendert, 
                was rechts steht. Falls error = null -> nichts wird gerendert.*/}
          
          <div className='register-container'>
            <p>Have an account already?</p>
            <Link to='/login' className='login-link'>Login</Link>
          </div>
        </div>
        </div>
        </>
    )
}