import Image from "next/image";
import Link from "next/link";

const MenuCard = (props: {
  icon: string;
  title: string;
  link: string;
  description: string;
}) => {
  return (
    <Link
      href={props.link}
      className="group flex min-h-[168px] flex-col justify-between rounded-[12px] border border-hairline bg-surface p-5 transition-colors hover:border-brand focus-visible:border-brand"
    >
      <div className="flex flex-row items-start justify-between gap-4">
        <div className="shrink-0">
          <Image
            src={`/img/${props.icon}.webp`}
            alt=""
            width={48}
            height={48}
            unoptimized
          />
        </div>
        <div className="grow">
          <h2 className="mb-1.5 font-display text-lg font-bold tracking-tight">
            {props.title}
          </h2>
          <p className="text-sm leading-relaxed text-ink-muted">
            {props.description}
          </p>
        </div>
      </div>
      <span className="mt-4 self-end text-sm font-semibold text-brand">
        Acessar &rarr;
      </span>
    </Link>
  );
};

export default MenuCard;
