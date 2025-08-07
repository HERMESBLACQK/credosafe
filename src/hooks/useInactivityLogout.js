import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

let inactivityTimer;

const useInactivityLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = useCallback(() => {
    if (isAuthenticated) {
      dispatch(logoutUser());
      navigate('/signin', { state: { message: 'You have been logged out due to inactivity.' } });
    }
  }, [dispatch, navigate, isAuthenticated]);

  const resetTimer = useCallback(() => {
    clearTimeout(inactivityTimer);
    inactivityTimer = setTimeout(handleLogout, INACTIVITY_TIMEOUT);
  }, [handleLogout]);

  useEffect(() => {
    if (isAuthenticated) {
      const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
      
      const eventListener = () => resetTimer();

      events.forEach(event => {
        window.addEventListener(event, eventListener);
      });

      resetTimer(); // Initialize timer

      return () => {
        events.forEach(event => {
          window.removeEventListener(event, eventListener);
        });
        clearTimeout(inactivityTimer);
      };
    }
  }, [isAuthenticated, resetTimer]);

  return null;
};

export default useInactivityLogout;
