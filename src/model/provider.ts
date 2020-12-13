import { createContext } from "react";
import Worker from 'worker-loader!./data.worker';

export default createContext(new Worker());
