import Modal from './Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { RESOURCE_CATEGORIES } from '../../constants';

function CreateResourceModal({ isOpen, onClose, onSubmit, isLoading }) {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Resource" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          name="title"
          required
          placeholder="e.g. DP Cheatsheet - Week 3"
        />

        <div>
          <label className="block text-white text-xs font-medium mb-1.5">
            Description
          </label>
          <textarea
            name="description"
            maxLength={1000}
            rows={4}
            className="w-full px-3 py-2 bg-[#111111] border border-[#333333] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Optional. Describe what this resource contains, how to use it, etc."
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
              placeholder="Optional subject / tag"
              className="w-full px-3 py-2 bg-[#111111] border border-[#333333] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>
        </div>

        <div>
          <label className="block text-white text-xs font-medium mb-1.5">
            File
            <span className="text-gray-500 ml-1">*</span>
          </label>
          <div className="border border-dashed border-[#333333] rounded-lg p-4 text-center bg-[#0a0a0a]">
            <input
              type="file"
              name="file"
              required
              className="block w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-gray-100"
              accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx,image/*"
            />
            <p className="mt-2 text-[11px] text-gray-500">
              Max size 50MB. PDFs, docs, slides, spreadsheets, and images supported.
            </p>
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
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
          >
            Upload Resource
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateResourceModal;


