import { GoogleLogin } from '@react-oauth/google';
import { Flex } from 'antd';
import { Typography } from 'antd';
const { Title } = Typography;

export default function Login() {
  return (
    <Flex
      gap="middle"
      vertical
      justify='center'
      align='center'
      style={{
        height: '100vh',
        // width: '100vw',
      }}
      >
      <Title level={1}>Login to Asklytics</Title>
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