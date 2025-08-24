import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import EditProfile from '../screens/UserProfile/EditProfile';
import { Alert } from 'react-native';

// --- Mock navigation ---
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ goBack: jest.fn() }),
  useFocusEffect: jest.fn()
}));

// --- Mock translation ---
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

// --- Inline service mocks (fix for ReferenceError) ---
const mockGetProfile = jest.fn().mockResolvedValue({
  name: 'Old Name',
  bio: 'Old Bio'
});
const mockUpdateName = jest.fn().mockResolvedValue({});
const mockUpdateBio = jest.fn().mockResolvedValue({});

jest.mock('../api/ApiFactory', () => ({
  getUserService: () => ({
    getProfile: mockGetProfile,
    updateName: mockUpdateName,
    updateBio: mockUpdateBio
  })
}));

describe('EditProfile Screen', () => {
  it(
    'updates profile when fields are changed and button is pressed',
    async () => {
      const alertSpy = jest.spyOn(Alert, 'alert');

      const { getByPlaceholderText, getByText } = render(<EditProfile />);

      // Wait for the profile to load
      await waitFor(() => {
        expect(getByPlaceholderText('Username')).toBeTruthy();
      });

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

      // Verify that service methods were called
      expect(mockUpdateName).toHaveBeenCalledWith('New Name');
      expect(mockUpdateBio).toHaveBeenCalledWith('New Bio');
    },
    10000 // optional: increase timeout to 10s
  );
});
