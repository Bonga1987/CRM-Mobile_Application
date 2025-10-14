import { render, fireEvent, waitFor } from "@testing-library/react-native";
import LoginScreen from "../screens/login/LoginScreen";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

// Mock navigation
const mockNavigate = jest.fn();
const mockReset = jest.fn();
const navigation = {
  navigate: mockNavigate,
  dispatch: mockReset,
};

// Mock axios
jest.mock("axios");

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, "alert");

describe("LoginScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("shows alert when fields are empty", async () => {
    const { getByText, getByTestId } = render(
      <LoginScreen navigation={navigation} />
    );
    fireEvent.press(getByTestId("login-button"));
    expect(Alert.alert).toHaveBeenCalledWith(
      "Validation",
      "All fields are required"
    );
  });

  it("shows alert for invalid email", async () => {
    const { getByText, getByTestId, getByPlaceholderText } = render(
      <LoginScreen navigation={navigation} />
    );
    fireEvent.changeText(getByPlaceholderText("Email"), "invalid-email");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123!");
    fireEvent.press(getByTestId("login-button"));
    expect(Alert.alert).toHaveBeenCalledWith("Error", "Email is not valid!");
  });

  it("logs in successfully and navigates", async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: { name: "John Doe" },
    });

    const { getByText, getByTestId, getByPlaceholderText } = render(
      <LoginScreen navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText("Email"), "john@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123!");
    fireEvent.press(getByTestId("login-button"));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith("@isLoggedIn", "true");
      expect(Alert.alert).toHaveBeenCalledWith(
        "Login Success",
        "Welcome John Doe"
      );
      expect(mockNavigate).toHaveBeenCalled(); // or check CommonActions.reset if used
    });
  });

  it("shows alert on failed login", async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: [],
    });

    const { getByText, getByTestId, getByPlaceholderText } = render(
      <LoginScreen navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText("Email"), "john@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123!");
    fireEvent.press(getByTestId("login-button"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith("Login Failed");
    });
  });

  it("shows alert on axios error", async () => {
    axios.post.mockRejectedValue(new Error("Network Error"));

    const { getByText, getByTestId, getByPlaceholderText } = render(
      <LoginScreen navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText("Email"), "john@example.com");
    fireEvent.changeText(getByPlaceholderText("Password"), "password123!");
    fireEvent.press(getByTestId("login-button"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Something went wrong while logging in"
      );
    });
  });
});
