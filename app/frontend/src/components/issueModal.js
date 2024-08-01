import React from 'react';

const Modal = ({ show, handleClose, handleSubmit, issue, setIssue }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl">Flag Question</h2>
                <p className="mb-2">(Your instructor will see this message)</p>
                <form onSubmit={handleSubmit}>
                    <textarea
                        className="w-full p-2 border rounded mb-4 bg-gray-900"
                        rows="4"
                        value={issue}
                        onChange={(e) => setIssue(e.target.value)}
                        maxlength={250}
                        placeholder="Enter the issue concisely (ex. I selected A but it says I selected B)"
                    />
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
