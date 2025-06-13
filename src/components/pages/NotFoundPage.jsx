import { useNavigate } from 'react-router-dom';
import EmptyErrorLoadingState from '@/components/organisms/EmptyErrorLoadingState';

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-soft-white px-4">
      <EmptyErrorLoadingState 
        type="empty" // Or 'error' depending on context
        icon="Home"
        title="Property Not Found"
        message="The property you're looking for doesn't exist or may have been removed from our listings."
        onAction={() => navigate('/browse')}
        actionText="Browse Properties"
      />
    </div>
  );
};

export default NotFoundPage;