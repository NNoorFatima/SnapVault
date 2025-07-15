import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // backgroundColor: '#1b1b40',
    backgroundColor: 'black',
  },

  rectangle: {
    // paddingTop: 40,
    // paddingHorizontal: 16,
    // paddingBottom: 12,
    marginTop: 50,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderColor: '#1e1e50',
    // zIndex: 2,/
  },


  pictures: {
    textAlign: 'center',
    color: '#ffffff',
    // fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '600',
    // marginTop: 0,
    // zIndex: 12,
  },

  flexRowDd: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    paddingHorizontal: 8,
    marginBottom: 10,


  },
  group1:  {
    width: 42   ,
    height: 42,
    backgroundColor: '#4B8EA5',
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
  },

  regroup: {
    flexDirection: 'row',
    gap: 12,
  },


  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    gap: 20,
  },

  group3: {
    width: 40,
    height: 40,
  },

  group4: {
    width: 40,
    height: 40,
  },
});
