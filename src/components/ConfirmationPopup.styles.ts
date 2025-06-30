import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // optional dark overlay
  },
  container: {
    padding: 30,
    backgroundColor: '#1F1F51',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: '50%', // vertical center approx
    width: '80%',
    elevation: 5,
  },
  message: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // width: '0%',
    marginLeft: 15,
    marginRight: 15,
    marginTop: 10,
    gap: 3,
},
});

export default styles;
