import { ConfigProvider } from 'antd';

const UserTheme = ({ children }) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#1890ff', 
        colorInfo: '#1890ff',
        colorLink: '#1890ff',
        colorBgBase: '#ffffff', 
      },
    }}
  >
    {children}
  </ConfigProvider>
);

export default UserTheme;