"use client";

import { Button } from "@mui/material";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

const TopNav = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="container mx-auto h-[45px] mb-[12px] grid grid-flow-row grid-cols-5 gap-3">
      <Button
        variant="outlined"
        size="large"
        sx={{
          fontSize: "15px",
          fontWeight: "bold",
          textTransform: "capitalize",
          backgroundColor: "#FFFFFF",
        }}
        onClick={() => {
          router.push("/");
        }}
        className="flex flex-row justify-center items-center shadow-sm"
      >
        <Image src="/img/home.webp" alt="Home" width={24} height={24} />
        <span className="ml-3 hidden sm:inline-block">Home</span>
      </Button>
      <Button
        variant="outlined"
        size="large"
        sx={{
          fontSize: "15px",
          fontWeight: "bold",
          textTransform: "capitalize",
          backgroundColor: `${
            pathname.startsWith("/calculadora") ? "#1976D2" : "#FFFFFF"
          }`,
          "&:hover": {
            backgroundColor: `${
              pathname.startsWith("/calculadora") ? "#1976D2" : "inherit"
            }`,
          },
          color: `${
            pathname.startsWith("/calculadora") ? "#FFFFFF" : "#1976D2"
          }`,
        }}
        onClick={() => {
          router.push("/calculadora");
        }}
        className="flex flex-row justify-center items-center shadow-sm"
      >
        <Image
          src="/img/calculadora.webp"
          alt="Calculadora"
          width={24}
          height={24}
        />
        <span className="ml-3 hidden sm:inline-block">Calculadora</span>
      </Button>
      <Button
        variant="outlined"
        size="large"
        sx={{
          fontSize: "15px",
          fontWeight: "bold",
          textTransform: "capitalize",
          backgroundColor: `${
            pathname.startsWith("/jornada") ? "#1976D2" : "#FFFFFF"
          }`,
          "&:hover": {
            backgroundColor: `${
              pathname.startsWith("/jornada") ? "#1976D2" : "inherit"
            }`,
          },
          color: `${pathname.startsWith("/jornada") ? "#FFFFFF" : "#1976D2"}`,
        }}
        onClick={() => {
          router.push("/jornada");
        }}
        className="flex flex-row justify-center items-center shadow-sm"
      >
        <Image src="/img/jornada.webp" alt="Jornada" width={24} height={24} />
        <span className="ml-3 hidden sm:inline-block">Jornada</span>
      </Button>
      <Button
        variant="outlined"
        size="large"
        sx={{
          fontSize: "15px",
          fontWeight: "bold",
          textTransform: "capitalize",
          backgroundColor: `${
            pathname.startsWith("/tempo-total") ? "#1976D2" : "#FFFFFF"
          }`,
          "&:hover": {
            backgroundColor: `${
              pathname.startsWith("/tempo-total") ? "#1976D2" : "inherit"
            }`,
          },
          color: `${
            pathname.startsWith("/tempo-total") ? "#FFFFFF" : "#1976D2"
          }`,
        }}
        onClick={() => {
          router.push("/tempo-total");
        }}
        className="flex flex-row justify-center items-center shadow-sm"
      >
        <Image
          src="/img/tempototal.webp"
          alt="Tempo Total"
          width={24}
          height={24}
        />
        <span className="ml-3 hidden sm:inline-block">Tempo Total</span>
      </Button>
      <Button
        variant="outlined"
        size="large"
        sx={{
          fontSize: "15px",
          fontWeight: "bold",
          textTransform: "capitalize",
          backgroundColor: `${
            pathname.startsWith("/sobre") ? "#1976D2" : "#FFFFFF"
          }`,
          "&:hover": {
            backgroundColor: `${
              pathname.startsWith("/sobre") ? "#1976D2" : "inherit"
            }`,
          },
          color: `${pathname.startsWith("/sobre") ? "#FFFFFF" : "#1976D2"}`,
        }}
        onClick={() => {
          router.push("/sobre");
        }}
        className="flex flex-row justify-center items-center shadow-sm"
      >
        <Image src="/img/sobre.webp" alt="Sobre" width={24} height={24} />
        <span className="ml-3 hidden sm:inline-block">Sobre</span>
      </Button>
    </div>
  );
};

export default TopNav;
