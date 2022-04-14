import { StyleSheet, ScrollView } from "react-native";
import { Card, Text } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
const Wishes = ({ prayer, isPrayerToday, language }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Card.Title style={{ fontSize: 25, color: "#e8e8e8" }}>
          {isPrayerToday && "Today's "}
          {!isPrayerToday && `Past `}
          Prayer
        </Card.Title>

        <Card.Divider width={1} />
        <Text style={styles.prayer}>
          {prayer.content.find((item) => item.symbol === language).text}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Wishes;

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginBottom: 20,
    paddingBottom: 20,
    maxHeight: "70%",
    padding: 20,
    backgroundColor: "#262727",
    borderRadius: 10,
  },
  prayer: {
    fontSize: 13,
    color: "#0099FF",
    fontSize: 20,
  },
});
