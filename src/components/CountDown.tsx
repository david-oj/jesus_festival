import { useState, useEffect, useMemo, useCallback } from "react";

const CountDown = () => {
  const EVENT_DATE_ISO = "2025-08-14T09:00:00";

  const useCountdown = (targetMs: number) => {
    // calculate ms remaining,clamp ≥0
    // Memorize calcDiff so it only changes when targetMs changes
    const calcDiff = useCallback(
      () => Math.max(targetMs - Date.now(), 0),
      [targetMs]
    );
    // diff in ms
    const [diffMs, setDiffMs] = useState<number>(calcDiff());

    useEffect(() => {
      const tick = () => setDiffMs(calcDiff());
      const id = setInterval(tick, 1000);
      return () => clearInterval(id);
    }, [targetMs, calcDiff]);

    // break down into units
    const totalSeconds = Math.floor(diffMs / 1000);
    return {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60,
    };
  };

  const eventTimeMs = useMemo(() => new Date(EVENT_DATE_ISO).getTime(), []);
  const { days, hours, minutes, seconds } = useCountdown(eventTimeMs);
  const fmt = (n: number) => n.toString().padStart(2, "0");

  const countDown: { title: string; value: string; color: string }[] = [
    {
      title: "Days",
      value: fmt(days),
      color: "border-teal-400",
    },
    {
      title: "Hours",
      value: fmt(hours),
      color: "border-yellow-400",
    },
    {
      title: "Minutes",
      value: fmt(minutes),
      color: "border-red-400",
    },
    {
      title: "Seconds",
      value: fmt(seconds),
      color: "border-purple-400",
    },
  ];

  return (
    <div className="flex pb-4 justify-between max-lg:flex-col items-center gap-4">
      <h2 className="text-white text-center md:text-2xl text-lg font-bold font-montserrat">
        Happening This August
      </h2>
      <div className="flex md:gap-3 sm:gap-2 gap-1 ">
        {countDown.map((count, index) => (
          <div
            className={`flex ${count.color} max-lg:flex-col gap-1 items-center backdrop-blur-md border bg-white/10  rounded-2xl lg:rounded-lg text-white px-2 py-1`}
            key={index}
          >
            <h3 className="md:text-lg text-base font-montserrat font-medium">
              {count.title}:
            </h3>
            <p className="md:text-base text-sm font-satoshi md:font-normal ">
              {count.value}{" "}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountDown;
