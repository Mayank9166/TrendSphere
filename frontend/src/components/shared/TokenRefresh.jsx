import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInSuccess } from '@/redux/user/userSlice';
import { refreshTokenIfNeeded } from '@/config/api';

const TokenRefresh = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if (!currentUser) return;

    // Refresh token every 7 days (7 * 24 * 60 * 60 * 1000 milliseconds)
    const refreshInterval = setInterval(async () => {
      try {
        const refreshedUser = await refreshTokenIfNeeded();
        if (refreshedUser) {
          dispatch(signInSuccess(refreshedUser));
          console.log('Token refreshed automatically');
        }
      } catch (error) {
        console.error('Auto token refresh failed:', error);
      }
    }, 7 * 24 * 60 * 60 * 1000); // 7 days

    // Also refresh token when user becomes active after being idle
    const handleUserActivity = async () => {
      try {
        const refreshedUser = await refreshTokenIfNeeded();
        if (refreshedUser) {
          dispatch(signInSuccess(refreshedUser));
        }
      } catch (error) {
        console.error('Activity-based token refresh failed:', error);
      }
    };

    // Refresh token on user activity (after 1 hour of inactivity)
    let activityTimeout;
    const resetActivityTimeout = () => {
      clearTimeout(activityTimeout);
      activityTimeout = setTimeout(handleUserActivity, 60 * 60 * 1000); // 1 hour
    };

    // Listen for user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, resetActivityTimeout, true);
    });

    // Initial activity timeout
    resetActivityTimeout();

    return () => {
      clearInterval(refreshInterval);
      clearTimeout(activityTimeout);
      events.forEach(event => {
        document.removeEventListener(event, resetActivityTimeout, true);
      });
    };
  }, [currentUser, dispatch]);

  return null; // This component doesn't render anything
};

export default TokenRefresh; 