import { useState, useEffect, useMemo, useCallback } from "react";
import Form from "../components/Form";
import { students1, students2, students3 } from "@/assets/images";

const Home = () => {
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
    <section className="">
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
            <div className=" h-[280px] sm:h-[350px] md:h-[250px] lg:h-[300px] xl:h-[400px] mt-4 flex-col flex md:gap-4 gap-3">
              <div className="h-[55%] sm:rounded-2xl rounded-lg border border-white/50 overflow-hidden">
                <img
                  src={students2}
                  alt=""
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="h-[45%] flex md:gap-4 gap-3">
                <div className="w-1/2 sm:rounded-2xl rounded-lg border border-white/50 overflow-hidden">
                  <img
                    src={students1}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-1/2 sm:rounded-2xl rounded-lg border border-white/50 overflow-hidden">
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
              Jesus Festival kicks off on Thursday, August 14, 2025 at The
              Loveworld Arena, New Garage, Ibadan. Doors open at 9 AM. See you
              there!
            </p>

            <Form />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
