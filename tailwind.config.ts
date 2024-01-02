import { withTV } from "tailwind-variants/transformer";
import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default withTV({
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-poppins)", ...fontFamily.sans],
      },
      padding: {
        shorter4: "1vw",
        shorter3: "2vw",
        shorter2: "3vw",
        shorter: "4vw",
        normal: "6vw",
        longer: "8vw",
        longer2: "10vw",
        longer3: "12vw",
        longer4: "14vw",
        longer5: "16vw",
        longer6: "18vw",
        longer7: "20vw",
        longer8: "22vw",
        longer9: "24vw",
        longer10: "26vw",
      },
      margin: {
        shorter4: "1vw",
        shorter3: "2vw",
        shorter2: "3vw",
        shorter: "4vw",
        normal: "6vw",
        longer: "8vw",
        longer2: "10vw",
        longer3: "12vw",
        longer4: "14vw",
        longer5: "16vw",
        longer6: "18vw",
        longer7: "20vw",
        longer8: "22vw",
        longer9: "24vw",
        longer10: "26vw",
      },
      borderWidth: {
        0.5: "0.5px",
        1: "1px",
        1.5: "1.5px",
        3: "3px",
        5: "5px",
        10: "10px",
        12: "12px",
        14: "14px",
        16: "16px",
        18: "18px",
        20: "20px",
      },
      fontSize: {
        "10xl": "10rem",
        "11xl": "11rem",
      },
    },
  },
  plugins: [],
}) satisfies Config;
