import { AppRouter } from "./routes/AppRouter";
import * as Toast from "@radix-ui/react-toast";

export default function App() {
  return (
    <Toast.Provider swipeDirection="right">
      <AppRouter />
      <Toast.Viewport className="fixed top-5 right-5 z-50" />
    </Toast.Provider>
  );
}
