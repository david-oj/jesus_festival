import { useState, useEffect, useMemo, useCallback } from "react";
import Form from "../components/Form";
import { students1, students2, students3 } from "@/assets/images";

const Home = () => {
  const days = 25;
  const hours = 40;
  const minutes = 10;
  const seconds = 0;

  //   const resetCountdown = (
  //     newDays: number,
  //     newHours: number,
  //     newMinutes: number,
  //     newSeconds: number
  //   ) => {
  //     const newDurationMs =
  //       (newDays * 86400 + newHours * 3600 + newMinutes * 60 + newSeconds) * 1000;

  //     const newTargetTime = Date.now() + newDurationMs;
  //     localStorage.setItem("countdownTargetTime", newTargetTime.toString());
  //     setTimeLeft(Math.floor(newDurationMs / 1000)); // update state immediately
  //   };

  // Calculate the initial duration
  const initialDurationMs =
    (days * 86400 + hours * 3600 + minutes * 60 + seconds) * 1000;

  // Retrieve or set the countdown target time in localStorage
  const targetTime = useMemo(() => {
    if (typeof window === "undefined") return Date.now();

    const stored = localStorage.getItem("countdownTargetTime");
    if (stored) return parseInt(stored, 10);

    const newTarget = Date.now() + initialDurationMs;
    localStorage.setItem("countdownTargetTime", newTarget.toString());
    return newTarget;
  }, [initialDurationMs]);

  //Calculates time left
  const calculateTimeLeft = useCallback(() => {
    const difference = targetTime - Date.now();
    return Math.max(Math.floor(difference / 1000), 0);
  }, [targetTime]);

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(intervalId);
  }, [calculateTimeLeft]);

  const daysLeft = Math.floor(timeLeft / 86400);
  const hoursLeft = Math.floor((timeLeft % 86400) / 3600);
  const minutesLeft = Math.floor((timeLeft % 3600) / 60);
  const secondsLeft = timeLeft % 60;

  const formatTime = (timeValue: number) =>
    timeValue.toString().padStart(2, "0");

  const countDown: { title: string; value: string; color: string }[] = [
    {
      title: "Days",
      value: formatTime(daysLeft),
      color: "border-teal-400",
    },
    {
      title: "Hours",
      value: formatTime(hoursLeft),
      color: "border-yellow-400",
    },
    {
      title: "Minutes",
      value: formatTime(minutesLeft),
      color: "border-red-400",
    },
    {
      title: "Seconds",
      value: formatTime(secondsLeft),
      color: "border-purple-400",
    },
  ];

  return (
    <section className=" bg-[url('./assets/images/jesus_festival.jpg')] bg-[center_20%] bg-no-repeat bg-cover bg-fixed min-h-screen w-full relative">
      <div className=" bg-gradient-to-t from-black/90 to-black/10 absolute inset-0" />

      <div className="md:p-10 p-4">
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

        <div className="flex md:gap-8 gap-5 mt-8 max-md:flex-col">
          <div className="md:p-10 p-6 rounded-2xl flex-1 flex flex-col bg-white/10 text-white backdrop-blur-md border  border-white/50">
            <h3>Welcome, Trailblazers!</h3>
            <p className="mt-4">
              You’ve just closed one chapter—completed your secondary school
              journey—and now it’s time to celebrate in style. Jesus Festival is
              your moment: a day packed with energetic worship, live
              performances, and authentic stories that honor your grit, your
              dreams, and the bright road ahead.
            </p>
            <h3 className="mt-4">What to expect</h3>
            <ul className="list-disc list-inside mt-2">
              <li className=" max-w-xl font-satoshi ">
                <b>Electric Worship Sessions: </b> Feel the beat of live praise
                bands and worship artists who know how to get a room on its
                feet.
              </li>
              <li className=" max-w-xl font-satoshi ">
                <b>Inspiring Keynotes: </b> Hear from graduates just like you,
                plus dynamic speakers whose journeys from campus to callings
                will fire up your passion.
              </li>
              <li className=" max-w-xl font-satoshi ">
                <b>Creative Corners: </b> Poetry slams, open-mic spots, and art
                booths—express yourself, connect with peers, and show the world
                your fresh talents.
              </li>
              <li className=" max-w-xl font-satoshi ">
                <b>Next-Step Huddles: </b>Whether you’re headed to university,
                trade school, or diving straight into that dream job, our
                mentors have insider tips to help you own your next chapter.
              </li>
            </ul>
            <h3 className="mt-4">Why you can't miss it</h3>
            <p className="mt-4 ">
              This isn’t a stiff, sit-and-listen gathering. Think of it as the
              biggest after-party for your school years—only with a purpose.
              You’ll leave feeling celebrated, equipped, and plugged into a
              community that’s all about lifting you up. It’s the perfect blend
              of fun, faith, and future-focused inspiration.
            </p>
            <div className="bg-fuchsia-200/10 max-md:h-[380px] flex-grow mt-4 flex-col flex md:gap-4 gap-3">
              <div className="flex-1 max-h-[250px] rounded-2xl border border-white/50 overflow-hidden">
                <img
                  src={students2}
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="flex-1 flex md:gap-4 gap-3 md:max-h-[200px] max-md:max-h-[180px]">
                <div className="flex-1 rounded-2xl border border-white/50 overflow-hidden">
                  <img
                    src={students1}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 rounded-2xl border border-white/50 overflow-hidden">
                  <img
                    src={students3}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="md:p-10 p-6 rounded-2xl flex-1 text-white backdrop-blur-md border bg-white/10 border-white/50">
            <h3 className="max-md:text-center">Ready to Rock Your Future?</h3>
            <p className="mt-4 max-md:text-center">
              Grab your spot, bring your friends, and let’s make some noise.
              Jesus Festival kicks off at 10 AM on Saturday, July 12, at The
              Encounter Arena, Lagos. Doors open at 9 AM. See you there!
            </p>

            <Form />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
