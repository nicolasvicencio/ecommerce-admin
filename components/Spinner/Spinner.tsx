import React from "react";
import { PuffLoader } from "react-spinners";

export type SpinnerProps = {};

const Spinner: React.FC<SpinnerProps> = () => {
  return <PuffLoader />;
};

export default Spinner;
