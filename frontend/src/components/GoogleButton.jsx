import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import './GoogleButton.css';

function GoogleButton() {
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/auth/google', {
        token: credentialResponse.credential, // ✅ correct token
      });

      console.log('User:', res.data);
    } catch (err) {
      console.error('Login error:', err);
    }
  };

  return (
    <div className="google-btn-wrapper">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log('Login Failed')}
        useOneTap={false}
        theme="outline"
        size="large"
        text="continue_with"
        shape="pill"
      />
    </div>
  );
}

export default GoogleButton;