// src/contexts/WeekRangeContext.js
import React, { createContext, useContext, useState } from 'react';

const WeekRangeContext = createContext();

export const WeekRangeProvider = ({ children }) => {
  const [weekRange, setWeekRange] = useState('');

  return (
    <WeekRangeContext.Provider value={{ weekRange, setWeekRange }}>
      {children}
    </WeekRangeContext.Provider>
  );
};

export const useWeekRange = () => useContext(WeekRangeContext);
