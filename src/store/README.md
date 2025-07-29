# Redux Store Setup

This directory contains the Redux store configuration for the CredoSafe application.

## Structure

```
src/store/
├── index.js          # Main store configuration
├── hooks.js          # Custom hooks for typed Redux usage
├── slices/           # Redux slices
│   ├── authSlice.js  # Authentication state management
│   ├── voucherSlice.js # Voucher state management
│   └── uiSlice.js    # UI state management
└── README.md         # This file
```

## Store Configuration

The store is configured using Redux Toolkit and includes:

- **Authentication Slice**: Manages user login/logout, user data, and authentication state
- **Voucher Slice**: Handles voucher creation, fetching, and status updates
- **UI Slice**: Manages UI state like modals, notifications, theme, and loading states

## Usage

### Basic Usage

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../store/slices/authSlice';

const MyComponent = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleLogin = () => {
    dispatch(loginUser({ email: 'user@example.com', password: 'password' }));
  };

  return (
    <div>
      {isAuthenticated ? `Welcome, ${user?.name}` : 'Please log in'}
    </div>
  );
};
```

### Available Actions

#### Authentication
- `loginUser(credentials)` - Login user
- `logoutUser()` - Logout user
- `clearError()` - Clear authentication errors
- `updateUser(userData)` - Update user information

#### Vouchers
- `createVoucher(voucherData)` - Create new voucher
- `fetchVouchers()` - Fetch user's vouchers
- `updateVoucherStatus({ voucherId, status })` - Update voucher status
- `setCurrentVoucher(voucher)` - Set current voucher
- `updateFilters(filters)` - Update voucher filters

#### UI
- `toggleTheme()` - Toggle between light/dark theme
- `openModal(modalName)` - Open specific modal
- `closeModal(modalName)` - Close specific modal
- `showToast({ message, type })` - Show toast notification
- `addNotification(notification)` - Add notification
- `setLoading({ key, value })` - Set loading state

### State Structure

```javascript
{
  auth: {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,
    error: null
  },
  vouchers: {
    vouchers: [],
    currentVoucher: null,
    loading: false,
    error: null,
    filters: {
      type: 'all',
      status: 'all',
      dateRange: null
    }
  },
  ui: {
    theme: 'light',
    sidebarOpen: false,
    modals: {
      login: false,
      register: false,
      createVoucher: false,
      voucherDetails: false
    },
    notifications: [],
    loading: {
      global: false,
      auth: false,
      vouchers: false
    },
    toast: {
      show: false,
      message: '',
      type: 'info'
    }
  }
}
```

## Async Actions

The store includes async thunks for API calls:

- Authentication: Login/logout with simulated API delays
- Vouchers: Create, fetch, and update vouchers
- All async actions include loading states and error handling

## Persistence

- Authentication token is persisted in localStorage
- Theme preference is persisted in localStorage
- Other state is not persisted (resets on page refresh)

## Example Component

See `src/components/ReduxExample.jsx` for a complete example of Redux usage. 