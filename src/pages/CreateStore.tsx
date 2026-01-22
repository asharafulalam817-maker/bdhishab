import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateStore() {
  const navigate = useNavigate();
  
  // Demo Mode: Redirect to dashboard
  useEffect(() => {
    navigate('/dashboard', { replace: true });
  }, [navigate]);

  // Show nothing while redirecting
  return null;
}
