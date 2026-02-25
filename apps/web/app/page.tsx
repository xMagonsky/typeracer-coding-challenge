import { TypeRacer } from "./components/TypeRacer";
import { STATIC_PHRASE } from "./constants/game";

export default function Home() {
  return <TypeRacer phrase={STATIC_PHRASE} />;
}
