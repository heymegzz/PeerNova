import Modal from './Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { RESOURCE_CATEGORIES } from '../../constants';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import { useState } from 'react';

function EditResourceModal({ isOpen, onClose, onSubmit, onDelete, isLoading, resource }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!resource) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const file = formData.get('file');

    const payload = new FormData();
    payload.append('title', formData.get('title'));
    payload.append('description', formData.get('description') || '');
    payload.append('category', formData.get('category'));
    if (formData.get('subject')) {
      payload.append('subject', formData.get('subject'));
    }
    if (file && file.size > 0) {
      payload.append('file', file);
    }

    onSubmit?.(payload);
  };

  const handleConfirmDelete = async () => {
    await onDelete?.(resource);
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Edit Resource" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            name="title"
            required
            defaultValue={resource.title}
          />

          <div>
            <label className="block text-white text-xs font-medium mb-1.5">
              Description
            </label>
            <textarea
              name="description"
              maxLength={1000}
              rows={4}
              defaultValue={resource.description}
              className="w-full px-3 py-2 bg-[#111111] border border-[#333333] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <p className="mt-1 text-gray-500 text-[11px] text-right">
              Max 1000 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white text-xs font-medium mb-1.5">
                Category
                <span className="text-gray-500 ml-1">*</span>
              </label>
              <select
                name="category"
                required
                defaultValue={resource.category}
                className="w-full px-3 py-2 bg-[#111111] border border-[#333333] rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="">Select category</option>
                {RESOURCE_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white text-xs font-medium mb-1.5">
                Subject (optional)
              </label>
              <input
                name="subject"
                defaultValue={resource.subject}
                placeholder="Optional subject / tag"
                className="w-full px-3 py-2 bg-[#111111] border border-[#333333] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-white text-xs font-medium mb-1.5">
              Replace File (optional)
            </label>
            <div className="border border-dashed border-[#333333] rounded-lg p-4 text-center bg-[#0a0a0a]">
              <input
                type="file"
                name="file"
                className="block w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-gray-100"
                accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,image/*"
              />
              {resource.fileName && (
                <p className="mt-2 text-[11px] text-gray-500">
                  Current file: {resource.fileName}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-xs text-gray-500 hover:text-gray-300 underline underline-offset-2 text-left"
            >
              Delete this resource
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
        itemName={resource.title}
        isLoading={isLoading}
        title="Delete Resource"
        message="Are you sure you want to delete this resource? This action cannot be undone."
      />
    </>
  );
}

export default EditResourceModal;


