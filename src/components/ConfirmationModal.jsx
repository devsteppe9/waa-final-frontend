export default function ConfirmationModal({ title, message, onClose, onConfirm }) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
          <h2 className="text-xl font-semibold mb-4">{title}</h2>
          <p>{message}</p>
          <div className="mt-4 flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 bg-blue-600 text-white rounded-md">Yes</button>
          </div>
        </div>
      </div>
    );
  }
  