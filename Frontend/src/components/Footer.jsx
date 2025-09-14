export default function Footer() {
  return (
    <footer className="bg-black/40 text-white py-2 mt-10 ">
      <div className="container mx-auto text-center">
        <p className=" text-xl">
          Made by <span className=" font-bold">Thomas, Ahmed and Marvin</span>{" "}
          with FUN ( ͡° ͜ʖ ͡°)
        </p>
        <p className="text-m mt-2  text-gray-50 ">
          © {new Date().getFullYear()} - All rights reserved
        </p>
      </div>
    </footer>
  );
}
