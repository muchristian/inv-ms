import logo from "./logo.svg";
import "./App.scss";
import "antd/dist/reset.css";
import {
  BrowserRouter,
  HashRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./screen/Login";
import Category from "./screen/Category";
import Product from "./screen/Product";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Hold from "./screen/Hold";
import Comptoir from "./screen/Comptoir";
import Stock from "./screen/Stock";
import Expense from "./screen/Expense";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <HashRouter basename="/">
          <Routes>
            <Route element={<Login />} path="/login" />
            <Route element={<Category />} path="/category" />
            <Route element={<Product />} path="/product" />
            <Route element={<Stock />} path="/" />
            <Route element={<Comptoir />} path="/comptoir" />
            <Route element={<Hold />} path="/hold" />
            <Route element={<Expense />} path="/expense" />
            {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
          </Routes>
        </HashRouter>
      </Provider>
    </div>
  );
}

export default App;
