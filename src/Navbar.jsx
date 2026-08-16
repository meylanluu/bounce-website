import React, {useState} from 'react';
import { Link, useNavigate } from 'react-router-dom'; //React Router: provides routing capabilities for React applications

import { useAuth } from './data/authContext'
import { signOut } from './data/authService'

import user_img from './assets/user_img.png'
import logout from './assets/logout.png'
import './Navbar.css';

function Navbar() {  {/*  */}

    const { user } = useAuth();
    const navigate = useNavigate(); 

    async function handleLogout(){
        await signOut()
    }

    const [isMenuOpen, setIsMenuOpen] = useState(false)
    
    return(
    
        <nav className='navbar'>
            <div className='navbar-container'>
                
                 {/* Bounce Logo */}
                <Link to= '/' className='navbar-title'>BOUNCE</Link>

                 {/* Discover & Profile */}
                <ul className='nav-tabs'>
                    
                    <Link to='/discover' className='nav-links'>Discover</Link>
                    <Link to='/' className='nav-links'>Home</Link>
                    
                    {/* Bedingte Anzeige: Anzeige wenn User eingeloggt ist : Anzeige wenn User nicht eingeloggt ist*/}
                    {user ? (
                       <div className='menu-container'>
                            <div className='menu-trigger'>
                                <img
                                    src='src\assets\pfp.jpeg'
                                    alt='Profilbild'
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                />
                            </div>

                            {/* wird angezeigt wenn isMenuOpen = true ist */}
                            {isMenuOpen && (
                                <div className='dropdown-menu'>
                                    <ul>
                                        <DropdownItem img = {user_img} text ={'My Profile'} path = '/profile' onClick={()=>setIsMenuOpen(false)}/>
                                        <button className='logout-button' onClick={()=> {handleLogout(); setIsMenuOpen(false);}}>
                                            <img src={logout} className='dropdown-icons'></img>Logout</button>
                                    </ul>
                                </div>
                            )}
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