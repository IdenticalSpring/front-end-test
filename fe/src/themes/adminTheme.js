import { ConfigProvider } from 'antd';

const AdminTheme = ({ children }) => (
  <ConfigProvider
    theme={{
      token: {
        colorPrimary: '#1890ff',
        colorInfo: '#1890ff',
        colorLink: '#1890ff',
      },
      components: {
        Menu: {
          colorItemBg: 'transparent',
          colorItemText: '#fff',
          colorItemTextSelected: '#fff',
          colorItemBgSelected: 'rgba(255, 255, 255, 0.2)',
          colorItemTextHover: '#fff',
        },
      }
    }}
  >
    {children}
  </ConfigProvider>
);

export default AdminTheme;