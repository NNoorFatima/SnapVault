import '@testing-library/jest-native/extend-expect';
import 'jest-fetch-mock';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('react-native-localize', () => ({
  getLocales: () => [
    { countryCode: 'PK', languageTag: 'en-PK', languageCode: 'en', isRTL: false },
  ],
  getNumberFormatSettings: () => ({
    decimalSeparator: '.',
    groupingSeparator: ',',
  }),
  getCalendar: () => 'gregorian',
  getCountry: () => 'PK',
  getCurrencies: () => ['PKR'],
  getTemperatureUnit: () => 'celsius',
  getTimeZone: () => 'Asia/Karachi',
  uses24HourClock: () => true,
  usesMetricSystem: () => true,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

jest.mock('react-native-fs', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
  unlink: jest.fn(),
  mkdir: jest.fn(),
  exists: jest.fn().mockResolvedValue(true),
  downloadFile: jest.fn(() => ({
    promise: Promise.resolve({ statusCode: 200 }),
  })),
  DocumentDirectoryPath: '/mocked/documents',
  ExternalDirectoryPath: '/mocked/external',
}));
