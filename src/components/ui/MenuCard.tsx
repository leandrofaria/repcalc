import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Image from "next/image";
import Link from "next/link";

const MenuCard = (props: {
  icon: string;
  title: string;
  link: string;
  description: string;
}) => {
  return (
    <Link href={props.link}>
      <Card
        variant="outlined"
        className="bg-white shadow-md p-3 py-6 hover:border-[#1976D2] flex flex-col justify-between min-h-[210px]"
      >
        <CardContent>
          <div className="flex flex-row justify-between items-start">
            <div className="shrink-0">
              <Image
                src={`/img/${props.icon}.webp`}
                alt={props.title}
                width={60}
                height={60}
              />
            </div>
            <div className="grow ml-[24px]">
              <h3 className="text-lg font-semibold mb-2 border-b-[1px] border-b-[#E9E9E9]">
                {props.title}
              </h3>
              <h4 className="text-base text-[#696969] text-justify">
                {props.description}
              </h4>
            </div>
          </div>
        </CardContent>
        <CardActions className="flex flex-row justify-end items-center">
          <Button size="small" variant="outlined">
            Acessar
          </Button>
        </CardActions>
      </Card>
    </Link>
  );
};

export default MenuCard;
