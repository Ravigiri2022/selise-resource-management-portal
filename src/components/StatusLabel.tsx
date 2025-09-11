import React from 'react'

const StatusLabel: React.FC<{ status: string }> = ({ status }) => {
    return (
        <span className={`px-2 py-1 rounded-full text-xs capitalize sm:text-base ${status === "done" ?
            "bg-emerald-100 text-emerald-700" : status === "in-progress" ?
                "bg-yellow-100 text-yellow-700" : status === "reschedule" ?
                    "bg-purple-200 text-purple-700" : status === "unseen" ?
                        "bg-gray-200 text-gray-700" : "bg-blue-200 text-blue-700"}`}>
            {status}
        </span>
    )
}

export default StatusLabel