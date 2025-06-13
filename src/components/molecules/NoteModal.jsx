import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';

const NoteModal = ({ isOpen, onClose, onSubmit, initialNote = '' }) => {
  const [localNote, setLocalNote] = useState(initialNote);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(localNote);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose} // Close on backdrop click
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg p-6 max-w-md w-full"
          onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
        >
          <Text as="h3" className="text-lg font-semibold mb-4">
            Add Note
          </Text>
          <form onSubmit={handleSubmit}>
            <Input
              as="textarea"
              value={localNote}
              onChange={(e) => setLocalNote(e.target.value)}
              placeholder="Add your thoughts about this property..."
              className="w-full h-24 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex space-x-3 mt-4">
              <Button
                type="submit"
                className="flex-1 bg-primary text-white"
              >
                Save Note
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </Button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NoteModal;