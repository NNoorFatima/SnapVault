import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  rectangle: {
    marginTop: 25,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderColor: '#1e1e50',
  },
  pictures: {
    color:'white',
    fontSize: 24, 
    fontWeight: '600', 
    marginStart: '25%'
  },

  flexRowDd: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 54,
    paddingHorizontal: 8,
    marginBottom: 10,
  },
  iconBackground:  {
    width: 42   ,
    height: 42,
    // backgroundColor: '#4B8EA5',
    backgroundColor: '#1F2937',
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
    alignSelf: 'center',
    margin: 20,
    gap: 18,
    backgroundColor: '#1F2937',
    // backgroundColor: '#4B8EA5',
    padding:8,
    borderRadius: 100,
    
    width:'23%',

  },

  group3: {
    width: 40,
    height: 40,
  },

  group4: {
    width: 40,
    height: 40,
  },
  backButton:{
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: '#1F2937',
    // backgroundColor: '#4B8EA5',
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: 15
  },
  tabBar:{
    flexDirection: 'row',
    alignItems: 'center', 
  }
});
