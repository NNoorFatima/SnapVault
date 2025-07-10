import { I18nManager } from 'react-native';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    // backgroundColor: '#B7E2FF',
    backgroundColor: 'rgba(141, 184, 188, 0.9)', // same blue as sign in/up button with soft opacity
    borderRadius: 30,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    marginTop: 65,
    //replacing left/right with start end to handle rtl
    marginStart:20,
    marginEnd:20,
    width: '90%',
    // alignItems: 'center',
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
    height: 2,
    backgroundColor: '#ccc',
    marginVertical: 12,
    alignSelf: 'stretch',
    opacity: 0.8,
  },
  // avatar: {
  //   // width: 100,
  //   // height: 100,
  //   borderRadius: 30,
  //   marginBottom: 10,
    
  //   //added to handle rtl 
  //   marginStart: 10,
  //   marginEnd: 10
  // },
  avatar: {
  width: '28%',            // Percent-based for flexibility
  aspectRatio: 4 / 4,      // Makes it rectangular (taller than wide)
  borderRadius: 16,        // Slightly rounded corners
  marginBottom: 13,
  marginStart: 10,
  marginEnd: 10,

  // Optional: border and shadow for polish
  borderWidth: 1,
  borderColor: '#ddd',

  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},

  name: { fontSize: 18, fontWeight: 'bold', textAlign: I18nManager.isRTL ? 'right' : 'left' },
  phone: { fontSize: 14, color: '#222831', textAlign: I18nManager.isRTL ? 'right' : 'left' },
  email: { fontSize: 14, color: '#222831' , textAlign: I18nManager.isRTL ? 'right' : 'left'},
});

export default styles;
