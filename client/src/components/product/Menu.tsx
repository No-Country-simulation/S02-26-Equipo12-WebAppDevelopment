import { useMemo } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../redux/store";

import { Menu } from "antd";

import { riderCategories } from "../../utils/rider";
import { horseCategories } from "../../utils/horse";
import "./Menu.css";

import { setMenuItem } from "../../redux/store/slice/menuSlice";

const MenuComponent = () => {
  const menuItems = useMemo(() => {
    const riderItems = {
      key: "rider",
      label: "Rider",
      children: riderCategories.map((category) => {
        return {
          key: category.url,
          label: category.name,
          children: category.subcategories.map((subcategory) => ({
            key: subcategory.url,
            label: subcategory.name,
          })),
        };
      }),
    };

    const horseItems = {
      key: "horse",
      label: "Horse",
      children: horseCategories.map((category) => {
        return {
          key: category.url,
          label: category.name,
          children: category.subcategories.map((subcategory) => ({
            key: subcategory.url,
            label: subcategory.name,
          })),
        };
      }),
    };

    return [riderItems, horseItems];
  }, []);

  const dispatch = useDispatch<AppDispatch>();

  const handleClick = (e: { key: string }) => {
    dispatch(setMenuItem(e.key));
  };

  return (
    <Menu
      mode="horizontal"
      items={menuItems}
      className="main-menu"
      onClick={handleClick}
    />
  );
};

export default MenuComponent;
