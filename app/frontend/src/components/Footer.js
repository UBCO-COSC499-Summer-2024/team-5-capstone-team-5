import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../App'; // Adjust the path as needed

function Footer() {

    const { theme } = useTheme();

    return(
        <footer className={`rounded-lg shadow m-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
            <span className={`text-sm sm:text-center ${theme === 'dark' 
                                                        ? 'text-gray-500 dark:text-gray-400' 
                                                        : 'text-gray-900 dark:text-gray-800'}`}>
                © 2024 &nbsp; GradeIT. &nbsp; All Rights Reserved.
            </span>
            <ul className={`flex flex-wrap items-center mt-3 text-sm font-medium sm:mt-0 ${theme === 'dark' 
                                                        ? 'text-gray-500 dark:text-gray-400' 
                                                        : 'text-gray-900 dark:text-gray-800'}`}>
                <li>
                    <NavLink
                        to="/about"
                        className="hover:underline me-4 md:me-6"
                    >
                        About
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/contact"
                        className="hover:underline me-4 md:me-6"
                    >
                        Contact
                    </NavLink>
                </li>
            </ul>
            </div>
        </footer>
    );
}

export default Footer;
