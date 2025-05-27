import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import useAuthGuard, { AUTH_TOKEN_KEY } from "@/hooks/useAuthGuard";
import { API_BASE } from "@/lib/api";

type Student = {
  fullName: string;
  age: string;
  gender: string;
  email: string;
  phoneNumber: string;
  school: string;
  address: string;
  ParentGuardianNumber: string;
  howDidYouHearAboutUs: string;
  agreementFestivalEmailSms: boolean;
};
const Dashboard = () => {
  useAuthGuard();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const handleLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    window.location.href = "/login?logout=true";
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${API_BASE}/students`);
        const data = await res.json();

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Failed to load students");
        }

        setStudents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  return (
    <section className="relative grid sm:grid-cols-[auto_1fr] h-full w-full gap-3 p-2">

      {/* <div className=" bg-gradient-to-t from-black/0 to-black/10 absolute inset-0" /> */}
      {/* Navigation Sidebar */}
      <div
        className={`px-4 bg-white/10 z-10 md:sticky md:top-0 fixed md:h-screen overflow-hidden transform transition-[width] ease-in-out flex flex-col md:rounded-xl gap-2 backdrop-blur-md ${
          isCollapsed ? " w-8 h-8 items-center top-3 duration-250 left-3 rounded-full " : "w-[140px] h-full duration-500"
        }`}
      >
        <button onClick={() => setIsCollapsed((prev) => !prev)}>
          <h3 className="text-2xl float-right">{isCollapsed ? "+" : "x"}</h3>
        </button>

        <nav
          className={`flex flex-col  transform transition duration-500 ${
            isCollapsed
              ? "opacity-0 -translate-x-20 hidden"
              : "opacity-100 translate-x-0 block"
          }`}
        >
          <Link to="home">Home</Link>
          <Link to="" onClick={handleLogout}>
            logout
          </Link>
        </nav>
      </div>

      <div className="bg-white/10 min-w-full rounded-xl backdrop-blur-md max-md:py-14 md:p-8 p-4 ">
        <h3 className="max-sm:text-center">Dashboard</h3>
        <div className="flex flex-col max-sm:mx-auto max-sm:text-center bg-white/10 w-fit p-4 rounded-xl border border-white/30 mt-4">
          <span className="text-white md:text-2xl text-lg font-bold font-montserrat"> {students.length}</span>
          <span className="text-white font-satoshi font-medium text-base"> Total Registerations</span>
        </div>
        {loading ? (
          <p className="text-white/80 font-satoshi">Loading students...</p>
        ) : error ? (
          <p className="text-red-400 font-satoshi">{error}</p>
        ) : (
          <div className="overflow-x-auto rounded-xl mt-5">
            <table className="w-full text-left text-white font-satoshi border border-white/20 rounded-xl overflow-hidden">
              <thead className="bg-white/10 border-b border-white/20">
                <tr>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Age</th>
                  <th className="p-3">Gender</th>
                  <th className="p-3">Phone No</th>
                  <th className="p-3">school</th>
                  <th className="p-3">Address</th>
                  <th className="p-3">Parent/Guardian No</th>
                  <th className="p-3">Hear About</th>
                  <th className="p-3">Email/Sms</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, id) => (
                  <tr
                    key={id}
                    className="border-t border-white/10 hover:bg-white/5"
                  >
                    <td className="p-3">{student.fullName}</td>
                    <td className="p-3 ">{student.email}</td>
                    <td className="p-3">{student.age}</td>
                    <td className="p-3">{student.gender}</td>
                    <td className="p-3">{student.phoneNumber}</td>
                    <td className="p-3">{student.school}</td>
                    <td className="p-3">{student.address}</td>
                    <td className="p-3">{student.ParentGuardianNumber}</td>
                    <td className="p-3">{student.howDidYouHearAboutUs}</td>
                    <td className="p-3">{student.agreementFestivalEmailSms ? "Yes" : "No"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {students.length === 0 && (
              <p className="text-center text-white/70 mt-4">
                No students registered yet.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
