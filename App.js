import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

import Colors from "./Colors";
import tempData from "./tempData";
import TodoList from "./components/TodoList";
import AddListModal from "./components/AddListModal";
import Fire from "./Firebase";

export default function App() {
  const [addTodoVisible, setAddTodoVisible] = React.useState(false);
  const [lists, setLists] = React.useState(tempData);
  const [user, setUser] = React.useState({});
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    let firebase = new Fire((error, user) => {
      if (error) {
        return Alert.alert("error");
      }

      firebase.getLists((lists) => {
        setLists(lists),
          setUser(user),
          () => {
            setLoading(false);
          };
      });

      setUser(user), setLoading(false);
    });
    return () => firebase.detach();
  }, []);

  const toogleAddTodoVisible = () => setAddTodoVisible(!addTodoVisible);

  const toogleAddTodoModal = () => setAddTodoVisible(false);

  const renderList = (list) => <TodoList list={list} updateList={updateList} />;

  const addList = (list) => {
    setLists([...lists, { ...list, id: lists.length + 1, todos: [] }]);
  };

  const updateList = (list) => {
    setLists([...lists.map((item) => (item.id === list.id ? list : item))]);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.blue} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        visible={addTodoVisible}
        onRequestClose={toogleAddTodoModal}
      >
        <AddListModal closeModal={toogleAddTodoModal} addList={addList} />
      </Modal>
      <View>
        <Text>{user?.uid}</Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.divider} />
        <Text style={styles.title}>
          Todo
          <Text style={{ fontWeight: "300", color: Colors.blue }}> Lists</Text>
        </Text>
        <View style={styles.divider} />
      </View>

      <View style={{ marginVertical: 48 }}>
        <TouchableOpacity style={styles.addList} onPress={toogleAddTodoVisible}>
          <AntDesign name="plus" size={16} color={Colors.blue} />
        </TouchableOpacity>
        <Text style={styles.add}>Add List</Text>
      </View>
      <View style={{ height: 275, paddingLeft: 32 }}>
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => renderList(item)}
          keyboardShouldPersistTaps="always"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    backgroundColor: Colors.lightBlue,
    height: 1,
    flex: 1,
    alignSelf: "center",
  },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: Colors.black,
    paddingHorizontal: 64,
  },
  addList: {
    borderWidth: 2,
    borderColor: Colors.lightBlue,
    borderRadius: 4,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  add: {
    color: Colors.blue,
    fontWeight: "600",
    fontSize: 14,
    marginTop: 8,
  },
});
