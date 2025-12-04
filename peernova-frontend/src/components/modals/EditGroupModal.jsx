import Modal from './Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { SUBJECTS } from '../../constants';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { useState } from 'react';

function EditGroupModal({ isOpen, onClose, onSubmit, onDelete, isLoading, group }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!group) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name')?.toString().trim(),
      description: formData.get('description')?.toString().trim(),
      subject: formData.get('subject')?.toString(),
      maxMembers: formData.get('maxMembers')
        ? Number(formData.get('maxMembers'))
        : group.maxMembers,
    };
    onSubmit?.(payload);
  };

  const handleConfirmDelete = async () => {
    await onDelete?.(group);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Study Group" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Group Name"
            name="name"
            required
            defaultValue={group.name}
          />

          <div>
            <label className="block text-white text-xs font-medium mb-1.5">
              Description
              <span className="text-gray-500 ml-1">*</span>
            </label>
            <textarea
              name="description"
              required
              maxLength={500}
              rows={4}
              defaultValue={group.description}
              className="w-full px-3 py-2 bg-[#111111] border border-[#333333] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <p className="mt-1 text-gray-500 text-[11px] text-right">
              Max 500 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-xs font-medium mb-1.5">
                Subject / Category
                <span className="text-gray-500 ml-1">*</span>
              </label>
              <select
                name="subject"
                required
                defaultValue={group.subject}
                className="w-full px-3 py-2 bg-[#111111] border border-[#333333] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="">Select subject</option>
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white text-xs font-medium mb-1.5">
                Max Members
              </label>
              <input
                type="number"
                name="maxMembers"
                min={2}
                max={500}
                defaultValue={group.maxMembers || 50}
                className="w-full px-3 py-2 bg-[#111111] border border-[#333333] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <p className="mt-1 text-gray-500 text-[11px]">
                Optional. Default is 50 members.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-2 text-left"
            >
              Delete this group
            </button>

            <div className="flex justify-end gap-3">
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
                type="submit"
                variant="primary"
                size="sm"
                isLoading={isLoading}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        itemName={group.name}
        isLoading={isLoading}
        title="Delete Study Group"
        message="Are you sure you want to delete this study group? This action cannot be undone."
      />
    </>
  );
}

export default EditGroupModal;


