import { type ThemeConfig } from "antd";

export const COLORS = {
  gray: "#999999",
  dark: "#333333",
  charcoal: "#373F51",
  briquette: "#de6262",
  hover: "#f1f1f1",
  hover2: "#f8f8f8",
  blue: "#008DD5",
  emerald: "#50C878",
  sunflower: "#FFC512",
};

export const theme: ThemeConfig = {
  token: {
    fontFamily: "var(--font-montserrat)",
  },
  components: {
    Menu: {
      itemSelectedColor: COLORS.hover,
      itemSelectedBg: COLORS.briquette,
      itemBg: COLORS.hover,
      itemHoverBg: "#D3D3D3",
      itemActiveBg: "#D3D3D3",
      itemColor: COLORS.dark,
    },
    Layout: {
      siderBg: COLORS.hover,
    },
    Table: {
      headerBg: COLORS.dark,
      headerColor: "white",
      headerSortHoverBg: COLORS.dark,
      headerSplitColor: COLORS.hover,
      borderColor: COLORS.hover,
      headerSortActiveBg: COLORS.blue,
      headerBorderRadius: 6,
      colorBgContainer: "white",
      cellPaddingBlock: 6,
      rowHoverBg: "white",
      headerFilterHoverBg: "",
    },
  },
};
