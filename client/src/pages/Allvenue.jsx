import React from 'react';
import Venues from "../components/Venues";
import { useScrollToTop } from "../hooks/useScrollToTop";

const Allvenue = () => {
  useScrollToTop();

  return (
    <div>
      <Venues />
    </div>
  );
}

export default Allvenue;
