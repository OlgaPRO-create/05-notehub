import { ScaleLoader } from "react-spinners";
import style from "./Loader.module.css";
export default function Loader() {
  return <div className={style.backdrop}>{<ScaleLoader color="blue" />}</div>;
}
