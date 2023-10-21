import { useState, useEffect } from "react";

export const useTimer = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (time > 0) {
        setTime(time - 1);
      }

      if (time === 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [time]);

  const start = (initialTime) => {
    setTime(initialTime);
  };

  return {
    start,
    time,
  };
};
