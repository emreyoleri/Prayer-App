import { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  AppState,
} from "react-native";
import Pagination from "../components/Pagination";
import Wishes from "../components/Wishes";
import Fire from "../Firebase";
import { SpeedDial, Button, Overlay } from "react-native-elements";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectDropdown from "react-native-select-dropdown";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const getTime = () => {
  let date, TimeType, hour, minutes, fullTime, month, day, year;
  date = new Date();
  hour = date.getHours();
  month = date.getMonth();
  day = date.getDate();
  year = date.getFullYear();
  if (hour <= 11) TimeType = "AM";
  else TimeType = "PM";

  if (hour > 12) hour = hour - 12;

  if (hour == 0) hour = 12;

  minutes = date.getMinutes();

  if (minutes < 10) minutes = "0" + minutes.toString();

  fullTime =
    hour.toString() + ":" + minutes.toString() + " " + TimeType.toString();

  const ddmmyy = day + "-" + month + "-" + year;

  return {
    fullTime,
    ddmmyy,
  };
};

const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff =
    now -
    start +
    (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  const oneDay = 1000 * 60 * 60 * 24;
  const day = Math.floor(diff / oneDay);
  return day;
};

const getFirstBrowserLanguage = function () {
  let nav = window.navigator,
    language;

  if (Array.isArray(nav.languages)) {
    for (let i = 0; i < nav.languages.length; i++) {
      language = nav.languages[i];
      if (language && language.length) return language;
    }
  }
  return null;
};

const Home = () => {
  const dayOfYear = getDayOfYear();
  const [prayers, setPrayers] = useState([]);
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [order, setOrder] = useState(dayOfYear - 1);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const [language, setLanguage] = useState(
    getFirstBrowserLanguage() ? getFirstBrowserLanguage() : "fr"
  );
  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => setVisible(!visible);

  const toggleOverlayAndSpeedDial = () => {
    setOpen(false);
    toggleOverlay();
  };

  const countries = [
    "English-en",
    "Arabic-ar",
    "Dutch-nl",
    "French-fr",
    "German-de",
    "Italian-it",
    "Japanese-ja",
    "Russian-ru",
    "Spanish-es",
    "Turkisch-tr",
  ];

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    AppState.addEventListener("change", _handleAppStateChange);
    return () => {
      AppState.removeEventListener("change", _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      console.log("App has come to the foreground");
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);

    console.log("AppState: ", appState.current);
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    return token;
  }

  useEffect(async () => {
    const value = await AsyncStorage.getItem("language");
    if (value && value !== "undefined") setLanguage(JSON.parse(value));
  }, []);

  useEffect(() => {
    const { fullTime, ddmmyy } = getTime();
    setTime(fullTime);
    setDate(ddmmyy);
    const getCurrentTime = setInterval(() => {
      const { fullTime, ddmmyy } = getTime();
      setTime(fullTime);
      setDate(ddmmyy);
    }, 1000);

    return () => clearInterval(getCurrentTime);
  }, []);

  useEffect(() => {
    let sended = false;
    const getCommonTime = setInterval(() => {
      function addZero(i) {
        if (i < 10) i = "0" + i;
        return i;
      }

      const date = new Date();
      let hour = addZero(date.getUTCHours());
      let min = addZero(date.getUTCMinutes());

      let time = hour + ":" + min;

      if (time === "20:00" && !sended) {
        if (prayers.slice(0, dayOfYear)[order]) {
          fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Accept-encoding": "gzip, deflate",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              to: expoPushToken,
              title: "Today's Prayer",
              body: prayers
                .slice(0, dayOfYear)
                [order].content.find((item) => item.symbol === language).text,
              data: { data: "goes here" },
              _displayInForeground: true,
            }),
          });
          sended = true;
        }
      }
    }, 1000);

    return () => clearInterval(getCommonTime);
  }, []);

  // ! firebase use effect
  useEffect(() => {
    let firebase = new Fire((error) => {
      if (error) {
        return alert("error");
      }

      firebase.getPrayers((prayers) => {
        setPrayers(prayers);
        setLoading(false);
      });
    });
    return () => firebase.detach();
  }, []);

  if (loading)
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <ActivityIndicator size="large" color="#6959cd" />
        <Text style={{ fontSize: 25, marginTop: 10, color: "white" }}>
          Loading...
        </Text>
      </View>
    );
  else if (prayers.length) {
    return (
      <View style={styles.container}>
        <Text style={styles.subHeader}>
          {date} / {time}
        </Text>
        <Wishes
          prayer={prayers.slice(0, dayOfYear)[order]}
          isPrayerToday={order + 1 >= dayOfYear}
          language={language}
        />

        <Pagination dayOfYear={dayOfYear} setOrder={setOrder} order={order} />

        <SpeedDial
          isOpen={open}
          icon={{ name: "settings", color: "#fff" }}
          openIcon={{ name: "close", color: "#fff" }}
          onOpen={() => setOpen(!open)}
          onClose={() => setOpen(!open)}
        >
          <SpeedDial.Action
            icon={{ name: "language", color: "#fff" }}
            title={countries.find((item) => item.split("-")[1] === language)}
            onPress={toggleOverlayAndSpeedDial}
          />
        </SpeedDial>

        <Overlay
          isVisible={visible}
          onBackdropPress={toggleOverlay}
          overlayStyle={{
            padding: 0,
            backgroundColor: "black",
            borderRadius: 20,
          }}
        >
          <View style={styles.overlay}>
            <Button
              containerStyle={{
                width: 200,
                marginHorizontal: 10,
                marginBottom: 20,
              }}
              title={` Language (${language})`}
              type="clear"
              titleStyle={{ color: "rgba(78, 116, 289, 1)", fontSize: 20 }}
              icon={
                <Ionicons
                  name="language"
                  size={24}
                  color="#6959cd"
                  style={{
                    marginRight: 10,
                  }}
                />
              }
            />
            <SelectDropdown
              data={countries}
              defaultValue={countries.find(
                (item) => item.split("-")[1] === language
              )}
              dropdownStyle={{
                backgroundColor: "#282A36",
                borderWidth: 0,
                borderRadius: 10,
              }}
              buttonStyle={{
                borderRadius: 10,
                backgroundColor: "#262727",
              }}
              buttonTextStyle={{
                color: "white",
              }}
              rowTextStyle={{
                color: "rgba(78, 116, 289, 1)",
              }}
              onSelect={async (selectedItem, index) => {
                await AsyncStorage.setItem(
                  "language",
                  JSON.stringify(selectedItem.split("-")[1])
                );
                setLanguage(selectedItem.split("-")[1]);
                toggleOverlay();
              }}
              buttonTextAfterSelection={(selectedItem, index) => {
                return selectedItem;
              }}
              rowTextForSelection={(item, index) => {
                return item;
              }}
            />
          </View>
        </Overlay>
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 25 }}>Prayer Not Found</Text>
      </View>
    );
  }
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "black",
  },
  subHeader: {
    backgroundColor: "#6959cd",
    color: "white",
    textAlign: "center",
    paddingVertical: 5,
    marginTop: 20,
    width: "100%",
    fontSize: 24,
  },
  overlay: {
    padding: 30,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
  },
});
