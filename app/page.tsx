"use client";

import Head from "next/head";
import Canvas from "@/Canvas/Canvas";
import Splash from "@/Splash/Splash";
import Selection from "@/Selection/Selection";
import ContextMenu from "@/ContextMenu/ContextMenu";
import Drop from "@/Drop/Drop";
import Debug from "@/Debug/Debug";

export default function Home() {
  return (
    <div>
      <Head>
        <link rel="shortcut icon" href="webref/favicon.ico" />
      </Head>
      <Canvas />
      <Splash />
      <Selection />
      <ContextMenu />
      <Drop />
      <Debug />
    </div>
  );
}
