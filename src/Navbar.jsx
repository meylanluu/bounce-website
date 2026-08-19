import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; //React Router: provides routing capabilities for React applications
import { getProfileById } from './data/profileService';
import { useAuth } from './data/authContext'
import { signOut } from './data/authService'

import user_img from './assets/user_img.png'
import logout from './assets/logout.png'
import calendar from './assets/calendar.png'
import './Navbar.css';

function Navbar() {  {/*  */}

    const { user } = useAuth();
    const navigate = useNavigate(); 
    
    const [profile, setProfile] = useState();
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user) return; 

        getProfileById(user.id)
        .then((data) => setProfile(data))
        .catch((error) => {
            console.log("Profile couldn't be loaded: ", error);
            setError("Profile couldn't be loaded.")
        })
    },[user])

    async function handleLogout(){
        await signOut()
        navigate('/')
    }
    
    return(
    
        <nav className='navbar'>
            <div className='navbar-container'>
                
                 {/* Bounce Logo */}
                <Link to= '/' id='navbar-link'>
                    <span className='navbar-title'>BOUNCE</span>
                </Link>

                 {/* Discover & Profile */}
                <ul className='nav-tabs'>
                    
                    {/* Bedingte Aneige: Anzeige wenn User eingeloggt ist : Anzeige wenn User nicht eingeloggt ist*/}
                    {user ? (
                        <div id='navbar_logged-in'>
                            <Link to='/' className='nav-links'>Discover</Link>
                            <Link to='/home' className='nav-links'>Home</Link>
                            <div className='menu-container'>
                                <div className='menu-trigger'>
                                    <img
                                        src={profile?.profile_pic} //*Optional Chaining: gibt undefined zurück wenn profile noch nicht geladen ist, anstatt Absturz 
                                        alt='Profilbild'
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    />
                                </div>

                                {/* wird angezeigt wenn isMenuOpen = true ist */}
                                {isMenuOpen && (
                                    <div className='dropdown-menu'>
                                        <ul>
                                            <div className='dropdown-menu-items'>
                                                <DropdownItem img={user_img} text ={'My Profile'} path = '/profile' onClick={()=>setIsMenuOpen(false)}/>
                                                <DropdownItem img={calendar} text={'New Event'} path='/create-event' onClick={()=>setIsMenuOpen(false)} /> 
                                            </div>
                                            <button className='logout-button' onClick={()=> {handleLogout(); setIsMenuOpen(false);}}>
                                                <img src={logout} className='dropdown-icons'></img>Logout</button>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                        ) : ( 
                            <button className='login-button'  onClick={()=>navigate('/login')}>Login</button>    
                    )} 
                    
                </ul>

            </div>
        </nav>
        
    ); 
}

function DropdownItem(props){
    return(
        <li className='dropdownItem'>
            <img className='dropdown-icons' src={props.img} alt={props.text}/>
            <Link className='dropdown-links' to={props.path} onClick={props.onClick}>{props.text}</Link>
        </li>
    )
}

export default Navbar;