import { AsyncStorage } from "react-native";
import createDataContext from "./createDataContext";
import { navigate } from "../navigationRef";

const authReducer = (state, action) => {
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signin":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        errorMessage: ""
      };
    case "signout":
      return { ...state, user: {}, token: "" };
    default:
      return state;
  }
};

const tryLocalSignin = (dispatch) => async () => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    dispatch({
      type: "signin",
      payload: { user: json.user, token: json.token },
    });
    navigate("ClientRecord");
  } else {
    navigate("SignIn");
  }
};

const signin = (dispatch) => async (email, password) => {
  try {
    console.log("testing signin function, ", email, password);
    const res = await fetch("http://localhost:8080/signIn/mySQL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    if (res.status === 200) {
      const json = await res.json();
      console.log("testing json in signin function, ", json);
      await AsyncStorage.setItem("token", json.token);
      dispatch({
        type: "signin",
        payload: { user: json.user, token: json.token },
      });
      navigate("ClientRecord");
    }

    if (res.status !== 200) {
      const json = await res.json();
      console.log("testing error, ", json);
      dispatch({
        type: "add_error",
        payload: json.error,
      });
    }
  } catch (err) {
    console.log(err);
  }
};

const signout = (dispatch) => async () => {
  await AsyncStorage.removeItem("token");
  dispatch({ type: "signout" });
  navigate("SignIn");
};

export const { Provider, Context } = createDataContext(
  authReducer,
  { signin, signout },
  { user: {}, token: "", errorMessage: "" } // original state
);
