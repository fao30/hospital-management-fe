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
  },
};
