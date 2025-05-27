import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="flex bg-[url('./assets/images/jesus_festival.webp')] bg-[center_20%] bg-no-repeat bg-cover bg-fixed bg-[#D6971F] min-h-screen flex-col w-full relative">
      <div className=" bg-gradient-to-t from-black/90 to-black/10 absolute inset-0" />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
