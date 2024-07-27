import React, { useState, useEffect } from "react";
import { faBell, faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NotificationBell = (props) => {
    const { userId } = props;
    const [flags, setFlags] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    const fetchFlags = async () => {
        const response = await fetch(`http://localhost/api/users/courses/flagged/${userId}`);
        const flags = await response.json();
        setFlags(flags);
        console.log(flags)
    }

    const handleBellClick = async () => {
        setShowNotifications((show) => !show);
    }

    const handleResolve = async (flagId) => {
        await fetch('http://localhost/api/users/courses/flagged/resolve', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": flagId
            }),
        });
        fetchFlags();
    }

    useEffect(() => {
        fetchFlags();
    }, [userId]);

    return (
        <div>
            <div className="flex m-4 cursor-pointer" onClick={handleBellClick}>
                <div className='w-3 h-3 rounded-full bg-red-700 translate-x-8'></div>
                <FontAwesomeIcon icon={faBell} size="2xl" />
            </div>
            {showNotifications && (
                <div className="bg-gray-900 h-[600px] w-[480px] absolute -translate-x-[440px] rounded-lg drop-shadow overflow-hidden">
                    <h1 className="text-xl p-4 border-b-[0.5px] border-white">Notifications</h1>
                    <div className="p-4 overflow-y-auto h-[calc(600px-72px)]">
                        {flags.length > 0 ? (
                            flags.map((flag, index) => (
                                <div key={index} className="mb-2 bg-gray-800 rounded-lg p-2">
                                    <h1><span className='font-semibold'>Exam: </span>{flag.exam_name ? flag.exam_name : "N/A"}</h1>
                                    <p><span className='font-semibold'>Question: </span>{flag.question_num ? flag.question_num : "N/A"}</p>
                                    <p><span className='font-semibold'>Student ID: </span>{flag.user_id ? flag.user_id : "N/A"}</p>
                                    <p><span className='font-semibold'>Issue: </span>{flag.issue}</p>
                                    <button className='flex rounded-lg mt-2 bg-white/10 p-1' onClick={() => {handleResolve(flag.id)}}>
                                        <FontAwesomeIcon icon={faCheck} className='translate-y-1 mx-1'/><p className="mx-1">Mark as resolved</p>
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p>No notifications</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default NotificationBell;
