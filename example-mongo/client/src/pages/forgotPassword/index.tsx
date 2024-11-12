import { AuthPage } from "@refinedev/antd";
import { notification } from "antd";
import { useForgotPassword } from "@refinedev/core"; // Import the hook

export const ForgotPassword = () => {
  const { mutate: forgotPassword } = useForgotPassword(); // Use the hook to handle forgot password

  const handleFormSubmit = async (values: any) => {
    // Call the default forgot password function
    forgotPassword(values, {
      onSuccess: () => {
        // Show the notification on success
        notification.success({
          message: "Email Sent",
          description:
            "We have sent you an email with instructions to reset your password.",
        });
      },
      onError: () => {
        // Show a notification on error
        notification.error({
          message: "Error",
          description: "Something went wrong. Please try again.",
        });
      },
    });
  };

  return (
    <AuthPage
      type="forgotPassword"
      formProps={{
        onFinish: handleFormSubmit, // Use the handleFormSubmit function when the form is submitted
      }}
    />
  );
};
