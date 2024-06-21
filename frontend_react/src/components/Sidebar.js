import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                {isOpen ? 'Close' : 'Menu'}
            </button>
            <div className={isOpen ? "sidebar open" : "sidebar"}>
                <h2>Menu</h2>
                <ul>
                    <li><Link to="/recipes" onClick={toggleSidebar}>🍳 Recipes</Link></li>
                    <li><Link to="/scanner" onClick={toggleSidebar}>📷 Scanner</Link></li>
                </ul>
            </div>
        </>
    );
}

export default Sidebar;
