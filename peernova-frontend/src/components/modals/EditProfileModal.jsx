import Modal from './Modal';
import Input from '../common/Input';
import Button from '../common/Button';

function EditProfileModal({ isOpen, onClose, onSubmit, isLoading, user }) {
  if (!user) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = new FormData();

    payload.append('name', formData.get('name'));
    payload.append('email', formData.get('email'));
    payload.append('university', formData.get('university') || '');
    payload.append('bio', formData.get('bio') || '');

    const file = formData.get('avatar');
    if (file && file.size > 0) {
      payload.append('avatar', file);
    }

    onSubmit?.(payload);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          required
          defaultValue={user.name || user.fullName}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          required
          defaultValue={user.email}
          disabled
        />

        <Input
          label="University / College"
          name="university"
          defaultValue={user.university}
          placeholder="Your institution (optional)"
        />

        <div>
          <label className="block text-white text-xs font-medium mb-1.5">
            Bio / About
          </label>
          <textarea
            name="bio"
            maxLength={500}
            rows={4}
            defaultValue={user.bio}
            className="w-full px-3 py-2 bg-[#111111] border border-[#333333] rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            placeholder="Tell others a bit about yourself (max 500 characters)."
          />
          <p className="mt-1 text-gray-500 text-[11px] text-right">
            Max 500 characters
          </p>
        </div>

        <div>
          <label className="block text-white text-xs font-medium mb-1.5">
            Profile Picture
          </label>
          <div className="border border-dashed border-[#333333] rounded-lg p-4 text-center bg-[#0a0a0a]">
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="block w-full text-xs text-gray-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-white file:text-black hover:file:bg-gray-100"
            />
            <p className="mt-2 text-[11px] text-gray-500">
              Optional. Square images (1:1) work best.
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
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default EditProfileModal;


