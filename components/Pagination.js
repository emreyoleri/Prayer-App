import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { Button } from "react-native-elements";

const Pagination = ({ setOrder, order, dayOfYear }) => {
  return (
    <View style={styles.container}>
      <Button
        style={{ zIndex: 1000 }}
        disabled={order === 0}
        onPress={() => setOrder(order - 1)}
        type="clear"
        icon={
          <Feather
            name="arrow-left-circle"
            size={48}
            color={order === 0 ? "gray" : "#0099FF"}
          />
        }
      />
      <Button
        style={{ zIndex: 1000 }}
        disabled={order + 1 >= dayOfYear}
        onPress={() => setOrder(order + 1)}
        type="clear"
        icon={
          <Feather
            name="arrow-right-circle"
            size={48}
            color={order + 1 >= dayOfYear ? "gray" : "#0099FF"}
          />
        }
      />
    </View>
  );
};

export default Pagination;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: "13%",
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingHorizontal: 32,
    opacity: 0.8,
  },
});
