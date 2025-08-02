import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text style = {styles.content}>Edit app/index.tsx to edit this screen.</Text>
      <Text>HI</Text>
      <Link href={"/about"}>Visit about screen</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,//column direction me rhega yh due to phone space
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"red",
    gap:10
  }, 
  content:{
    fontSize:22,
  }
})