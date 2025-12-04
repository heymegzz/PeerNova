import Modal from './Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { SUBJECTS } from '../../constants';

function CreateGroupModal({ isOpen, onClose, onSubmit, isLoading }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name')?.toString().trim(),
      description: formData.get('description')?.toString().trim(),
      subject: formData.get('subject')?.toString(),
      maxMembers: formData.get('maxMembers')
        ? Number(formData.get('maxMembers'))
        : 50,
    };
    onSubmit?.(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Study Group" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Group Name"
          name="name"
          required
          placeholder="e.g. DSA Wizards - Evening Batch"
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
            className="w-full px-3 py-2 bg-[#111111] border border-[#333333] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Describe the purpose of this group, meeting times, expectations, etc."
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
              defaultValue={50}
              className="w-full px-3 py-2 bg-[#111111] border border-[#333333] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <p className="mt-1 text-gray-500 text-[11px]">
              Optional. Default is 50 members.
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
            Create Group
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateGroupModal;


