import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

function App() {
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('http://localhost:5000/auth/google', {
        token: credentialResponse.credential,
      });

      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Login with Google</h1>

      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => console.log('Login Failed')}
      />
    </div>
  );
}

export default App;