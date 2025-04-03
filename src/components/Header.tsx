import { FaWallet } from "react-icons/fa";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg">
      <div className="container mx-auto p-5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FaWallet className="text-3xl" />
          <h1 className="text-3xl font-bold">PersonalPlan</h1>
        </div>
        <div>
          <span className="text-lg font-bold">Olá, Abel!</span>
        </div>
      </div>
    </header>
  );
}
