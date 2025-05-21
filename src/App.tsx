import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className=" bg-[url('./assets/images/jesus_festival.jpg')] bg-[center_20%] bg-no-repeat bg-cover bg-fixed min-h-screen w-full relative">
       <div className=" bg-gradient-to-t from-black/90 to-black/10 absolute inset-0" />
      <Outlet />
    </div>
  );
}

export default App;
