import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const HomePage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to browse page as the main entry point
    navigate('/browse', { replace: true });
  }, [navigate]);

  return null;
};

export default HomePage;