import Link from "next/link";
import Menu from "./menu";
import DataMenu from "@/json/footer-menu.json";
import { Input } from "@/components/atomics/input";
import { Button } from "@/components/atomics/button";
import Image from "next/image";
import { Separator } from "@/components/atomics/separator";

function Footer() {
  return (
    <footer className="bg-secondary">
      <div className="container mx-auto py-[100px]">
        <div className="grid grid-cols-5">
          <Menu title="Solutions" data={DataMenu.data.solutions} />
          <Menu title="Product" data={DataMenu.data.product} />
          <Menu title="Company" data={DataMenu.data.company} />
        </div>
        <Separator className="my-[50px] bg-separator-foreground" />
        <div className="flex items-center justify-between">
          <Image
            src="/images/logo-white.png"
            alt="xyzstay"
            height={36}
            width={133}
          />
          <span className="leading-6 text-white">
            I Putu Budi Subawa © 2025. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
