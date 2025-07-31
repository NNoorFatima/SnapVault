import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditProfile from '../screens/UserProfile/EditProfile';
import { Alert } from 'react-native';

// Mock navigation
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
  useFocusEffect: jest.fn()
}));

// Mock translation
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

// Mock getUserService
jest.mock('../api/ApiFactory', () => ({
  getUserService: () => ({
    getProfile: jest.fn().mockResolvedValue({
      name: 'Old Name',
      bio: 'Old Bio'
    }),
    updateName: jest.fn().mockResolvedValue({}),
    updateBio: jest.fn().mockResolvedValue({})
  })
}));

describe('EditProfile Screen', () => {
  it('updates profile when fields are changed and button is pressed', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert');

    const { getByPlaceholderText, getByText } = render(<EditProfile />);

    // Wait for profile data to load
    await waitFor(() => getByPlaceholderText('Username'));

    const nameInput = getByPlaceholderText('Username');
    const bioInput = getByPlaceholderText('Description');
    const updateButton = getByText('editProfile.update');

    fireEvent.changeText(nameInput, 'New Name');
    fireEvent.changeText(bioInput, 'New Bio');
    fireEvent.press(updateButton);

    // Wait for the alert to be shown
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith(
        'Success',
        'Profile updated successfully',
        expect.any(Array)
      );
    });
  });
});
