import React from "react";

interface PopupProps {
  children: React.ReactNode;
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const Popup: React.FC<PopupProps> = ({ children, setShowPopup }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        {children}

        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setShowPopup(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;
