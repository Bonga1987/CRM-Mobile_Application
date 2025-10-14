import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SignUpScreen from "../screens/signup/SignUpScreen";
import { Alert } from "react-native";
import axios from "axios";

// Mock navigation
const mockNavigate = jest.fn();
const navigation = { navigate: mockNavigate };

// Mock Alert
jest.spyOn(Alert, "alert");

// Mock axios
jest.mock("axios");

describe("SignUpScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all input fields and button", () => {
    const { getByPlaceholderText, getByText } = render(
      <SignUpScreen navigation={navigation} />
    );

    expect(getByPlaceholderText("Full Name")).toBeTruthy();
    expect(getByPlaceholderText("Address")).toBeTruthy();
    expect(getByPlaceholderText("Phone Number")).toBeTruthy();
    expect(getByPlaceholderText("Email")).toBeTruthy();
    expect(getByPlaceholderText("Driver’s License Number")).toBeTruthy();
    expect(getByPlaceholderText("Password")).toBeTruthy();
    expect(getByPlaceholderText("Confirm Password")).toBeTruthy();
    expect(getByText("Continue")).toBeTruthy();
  });

  it("shows alert if required fields are empty", () => {
    const { getByText } = render(<SignUpScreen navigation={navigation} />);

    fireEvent.press(getByText("Continue"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Validation",
      "All fields are required"
    );
  });

  it("shows alert for invalid password", () => {
    const { getByText, getByPlaceholderText } = render(
      <SignUpScreen navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText("Full Name"), "John Doe");
    fireEvent.changeText(getByPlaceholderText("Address"), "123 Street");
    fireEvent.changeText(getByPlaceholderText("Phone Number"), "0821234567");
    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(
      getByPlaceholderText("Driver’s License Number"),
      "AB123"
    );
    fireEvent.changeText(getByPlaceholderText("Password"), "weakpass");
    fireEvent.changeText(getByPlaceholderText("Confirm Password"), "weakpass");

    fireEvent.press(getByText("Continue"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Weak password",
      "Password must be at least 8 characters, include a number and a symbol"
    );
  });

  it("submits form successfully and navigates", async () => {
    axios.post.mockResolvedValue({
      status: 200,
      data: [1], // simulate a successful response
    });

    const { getByText, getByPlaceholderText } = render(
      <SignUpScreen navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText("Full Name"), "John Doe");
    fireEvent.changeText(getByPlaceholderText("Address"), "123 Street");
    fireEvent.changeText(getByPlaceholderText("Phone Number"), "0821234567");
    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(
      getByPlaceholderText("Driver’s License Number"),
      "AB123"
    );
    fireEvent.changeText(getByPlaceholderText("Password"), "Passw0rd!");
    fireEvent.changeText(getByPlaceholderText("Confirm Password"), "Passw0rd!");

    fireEvent.press(getByText("Continue"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Register Success",
        "Proceed to login"
      );
      expect(mockNavigate).toHaveBeenCalledWith("Login");
    });
  });

  it("shows alert if passwords do not match", () => {
    const { getByText, getByPlaceholderText } = render(
      <SignUpScreen navigation={navigation} />
    );

    fireEvent.changeText(getByPlaceholderText("Full Name"), "John Doe");
    fireEvent.changeText(getByPlaceholderText("Address"), "123 Street");
    fireEvent.changeText(getByPlaceholderText("Phone Number"), "0821234567");
    fireEvent.changeText(getByPlaceholderText("Email"), "test@example.com");
    fireEvent.changeText(
      getByPlaceholderText("Driver’s License Number"),
      "AB123"
    );
    fireEvent.changeText(getByPlaceholderText("Password"), "Passw0rd!");
    fireEvent.changeText(getByPlaceholderText("Confirm Password"), "Passw0rd?");

    fireEvent.press(getByText("Continue"));

    expect(Alert.alert).toHaveBeenCalledWith(
      "Password mismatch",
      "Passwords do not match."
    );
  });
});
