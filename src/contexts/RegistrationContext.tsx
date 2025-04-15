import React, { createContext, useState, useContext, ReactNode } from 'react';

type RegistrationData = {
  dateOfBirth?: string;
  gender?: string;
  hometown?: string;
  currentLocation?: string;
  profileImages?: string[];
  hobbies?: string[];
  // User profile fields
  fullName?: string;
  usageReason?: string;
  profession?: string;
  school?: string;
  didNotAttendUniversity?: boolean;
};

type RegistrationContextType = {
  registrationData: RegistrationData;
  updateRegistrationData: (data: Partial<RegistrationData>) => void;
  resetRegistrationData: () => void;
};

const defaultRegistrationData: RegistrationData = {};

// Create the context
const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

// Provider component
type RegistrationProviderProps = {
  children: ReactNode;
};

export const RegistrationProvider: React.FC<RegistrationProviderProps> = ({ children }) => {
  const [registrationData, setRegistrationData] = useState<RegistrationData>(defaultRegistrationData);

  const updateRegistrationData = (data: Partial<RegistrationData>) => {
    setRegistrationData(prevData => ({
      ...prevData,
      ...data
    }));
  };

  const resetRegistrationData = () => {
    setRegistrationData(defaultRegistrationData);
  };

  return (
    <RegistrationContext.Provider
      value={{
        registrationData,
        updateRegistrationData,
        resetRegistrationData
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

// Hook for using the context
export const useRegistration = (): RegistrationContextType => {
  const context = useContext(RegistrationContext);
  
  if (context === undefined) {
    throw new Error('useRegistration must be used within a RegistrationProvider');
  }
  
  return context;
};

export default RegistrationContext; 