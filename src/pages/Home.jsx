// Home.jsx
import React, { useState } from "react";
import { useAuth } from "../hooks/AuthContext";

const Home = () => {
  const { user } = useAuth();
  return <div className="">CONTENIDO</div>;
};

export default Home;
