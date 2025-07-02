import { I18nManager } from 'react-native';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    marginTop: 50,
    //replacing left/right with start end to handle rtl
    marginStart:12,
    marginEnd:12,
  },
  centeredSection: {
    alignItems: 'center',
    width: '100%',
  },
  leftSection: {
    // alignItems: 'flex-start',
    // alignItems: I18nManager.isRTL ? 'flex-end' : 'flex-start',
    alignItems: I18nManager.isRTL ? 'flex-end' : 'flex-start',
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
    //added to handle rtl 
    marginStart: 10,
    marginEnd: 10
  },
  name: { fontSize: 18, fontWeight: 'bold', textAlign: I18nManager.isRTL ? 'right' : 'left' },
  phone: { fontSize: 14, color: '#999', textAlign: I18nManager.isRTL ? 'right' : 'left' },
  email: { fontSize: 14, color: '#999' , textAlign: I18nManager.isRTL ? 'right' : 'left'},
});

export default styles;
