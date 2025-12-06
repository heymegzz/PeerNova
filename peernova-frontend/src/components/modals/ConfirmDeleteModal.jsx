import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import Modal from './Modal';
import Button from '../common/Button';

function ConfirmDeleteModal({ isOpen, onClose, onConfirm, title, message, itemName, isLoading }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title || 'Delete item'} size="sm">
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <p className="text-sm text-gray-200">
              {message || 'Are you sure you want to delete this item? This action cannot be undone.'}
            </p>
            {itemName && (
              <p className="mt-1 text-xs text-gray-500">
                Item:{' '}
                <span className="text-gray-300 font-medium">
                  {itemName}
                </span>
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmDeleteModal;


