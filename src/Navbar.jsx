import React, {useState} from 'react';
import { Link } from 'react-router-dom'; //React Router: provides routing capabilities for React applications
import './Navbar.css';

function Navbar() {  {/*  */}
    
    return(
        <nav className="navbar">
            <div className="navbar-container">
                
                 {/* Bounce Logo */}
                <Link to= "/home" className="navbar-title">BOUNCE</Link>

                 {/* Discover & Profile */}
                <ul className="nav-tabs">
                    
                    <Link to="/discover" className="nav-links">Discover</Link>
                    <Link to="/home" className="nav-links">Home</Link>
                    <Link to="/profile" className="nav-links">
                    <img src="src\assets\pfp.jpeg" alt="Profilbild" className="nav-profile" />
                </Link>
                </ul>

            </div>
        </nav>
        
    ); 
}

export default Navbar;