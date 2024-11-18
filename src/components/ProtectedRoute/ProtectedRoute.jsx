import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import PropTypes from 'prop-types';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useUser();

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};