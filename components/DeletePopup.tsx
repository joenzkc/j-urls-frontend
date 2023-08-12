import React from "react";
import { UrlDto } from "./util/UrlDto";
import { deleteUrl } from "./api/apiHelper";

interface PopupProps {
  setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
  url: UrlDto;
  setShowSuccessfulDelete: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeletePopup: React.FC<PopupProps> = ({
  setShowPopup,
  url,
  setShowSuccessfulDelete,
}) => {
  const onClickDelete = async () => {
    try {
      await deleteUrl(url.hashUrl);
      setShowPopup(false);
      setShowSuccessfulDelete(true);
      setTimeout(() => {
        setShowSuccessfulDelete(false);
      }, 2000);

      // const qr = await getQrCode(url);
      // setQrCode(url);
      // setShowQrCode(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg">
        <div>
          <h1 className="font-bold text-xl">Confirm delete?</h1>
          <p className="mt-1">
            You will no longer be able to create a URL with the same alias
          </p>
          <p className="text-red-500 font-semibold">
            Deleting URL {process.env.NEXT_PUBLIC_FRONTEND_URL}
            {url.hashUrl}
          </p>
        </div>
        <div className="grid grid-cols-2">
          <button
            className="mt-4 bg-bright_pink text-white px-4 py-2 mx-2 rounded"
            onClick={onClickDelete}
          >
            Delete
          </button>
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 mx-2 rounded"
            onClick={() => setShowPopup(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
