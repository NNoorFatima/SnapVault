import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    marginTop: 50,
    marginRight:12,
    marginLeft:12,
  },
  centeredSection: {
    alignItems: 'center',
    width: '100%',
  },
  leftSection: {
    alignItems: 'flex-start',
    width: '100%',
  },
  divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 12,
    alignSelf: 'stretch',
    opacity: 0.8,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: { fontSize: 18, fontWeight: 'bold' },
  phone: { fontSize: 14, color: '#999' },
  email: { fontSize: 14, color: '#999' },
});

export default styles;
