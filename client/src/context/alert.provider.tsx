import React, { createContext, useCallback, useContext, useState } from "react";
import { AlertType } from "../types";

type AlertContextType = {
  addAlert: (alert: AlertType) => void;
  removeAlert: (id: string) => void;
  alerts: AlertType[];
};

const AlertContext = createContext<AlertContextType>({} as AlertContextType);
AlertContext.displayName = "AlertContext";

export function useAlert() {
  return useContext(AlertContext);
}

export function AlertProvider({ children }: { children: React.ReactNode }) {
  // alerts (with different statuses (success, error))
  const [alerts, setAlerts] = useState<AlertType[]>([]);

  const addAlert = useCallback((newAlert: AlertType) => {
    newAlert.id = crypto.randomUUID();
    if (typeof newAlert.duration === "undefined") {
      newAlert.duration = 5;
    }
    setAlerts((prevAlerts) => [...prevAlerts, newAlert]);
    setTimeout(() => removeAlert(newAlert.id!), newAlert.duration * 1000);
  }, []);

  const removeAlert = (id: string) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  };

  const alertContextValue: AlertContextType = { addAlert, removeAlert, alerts };

  return (
    <AlertContext.Provider value={alertContextValue}>
      {children}
    </AlertContext.Provider>
  );
}
