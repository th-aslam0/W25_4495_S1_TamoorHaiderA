import { GoogleLogin } from '@react-oauth/google';
import { Flex } from 'antd';
export default function Login() {
  return (
    <Flex gap="middle" vertical justify='center' align='center'>
      <GoogleLogin
        onSuccess={credentialResponse => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log('Login Failed');
        }} />
    </Flex>
  );
}