'use client';
import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

const TimeClock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<string>(
    dayjs().format('HH:mm'),
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(dayjs().format('HH:mm'));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <>{currentTime}</>;
};

export default TimeClock;
