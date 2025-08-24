import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import SignInScreen from '../screens/SignIn/SignInScreen';
import { Alert } from 'react-native';

// Mocks
jest.mock('react-redux', () => ({
  useDispatch: () => jest.fn(() => Promise.resolve({ type: 'auth/loginUser/fulfilled', payload: { token: 'abc' } })),
  useSelector: () => ({ loading: false, error: null }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn() }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

jest.mock('../localization/i18n', () => ({
  __esModule: true,
  default: {},
  changeAppLanguage: jest.fn(),
}));

jest.mock('../components/CustomTextField', () => (props) => {
  const React = require('react');
  const { View, TextInput, Text } = require('react-native');
  return (
    <View>
      <Text>{props.label}</Text>
      <TextInput
        testID={`input-${props.label}`}
        value={props.value}
        onChangeText={props.onChangeText}
        placeholder={props.placeholder}
      />
    </View>
  );
});

jest.mock('../components/CustomButton', () => (props) => {
  const React = require('react');
  const { Text } = require('react-native');
  return (
    <Text onPress={props.onPress}>{props.buttonText}</Text>
  );
});

jest.mock('../components/ClickableText', () => (props) => {
  const React = require('react');
  const { Text } = require('react-native');
  return (
    <Text onPress={props.onPress}>{props.text}</Text>
  );
});

jest.mock('../components/CustomBox', () => (props) => {
  const React = require('react');
  const { View } = require('react-native');
  return <View>{props.children}</View>;
});

// Tests
describe('SignInScreen', () => {
  it('submits login when email and password are filled', async () => {
    const { getByTestId, getByText } = render(<SignInScreen navigation={{ navigate: jest.fn() }} />);

    const emailInput = getByTestId('input-SignIn.email');
    const passwordInput = getByTestId('input-SignIn.password');
    const loginButton = getByText('Button.signIn');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('shows alert on empty fields', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');
    const { getByText } = render(<SignInScreen navigation={{ navigate: jest.fn() }} />);
    const loginButton = getByText('Button.signIn');

    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Error', 'Please enter both email and password');
    });
  });
});



