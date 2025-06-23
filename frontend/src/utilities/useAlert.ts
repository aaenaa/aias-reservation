import { useState } from "react";

type AlertSeverity = "success" | "error" | "warning" | "info";

export const useAlert = () => {
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertSeverity, setAlertSeverity] = useState<AlertSeverity>("success");
  const [alertMessage, setAlertMessage] = useState<string>("");

  const handleAlertMessage = (message: string, severity: AlertSeverity) => {
    setAlertMessage(message);
    setAlertSeverity(severity);
    setShowAlert(true);
  };

  const handleCloseAlert = () => {
    setShowAlert(false);
  };

  return {
    showAlert,
    alertSeverity,
    alertMessage,
    handleAlertMessage,
    handleCloseAlert,
  };
};