import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProductList from "./ProductList";
import ProductDetail from "./ProductDetail";
import { Provider } from "react-redux";
import store from "../../redux/store";
import MenuComponent from "./Menu";

const App = () => {
  return (
    <Provider store={store}>
      <MenuComponent />
      <Router>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:handle" element={<ProductDetail />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
