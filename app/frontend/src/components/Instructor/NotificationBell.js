import React from "react";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NotificationBell = () => {

    

    return(
        <div className="flex m-4">
            <div className='w-3 h-3 rounded-full bg-red-700 translate-x-8'></div>
            <FontAwesomeIcon icon={faBell} size="2xl" />
        </div>
    )
}

export default NotificationBell;