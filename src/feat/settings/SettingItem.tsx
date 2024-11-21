import { cn } from "@/utils/styles";
import { Flex } from "@radix-ui/themes";
import { ReactNode } from "react";

type SettingItemProps = {
  className?: string;
  title: string;
  subtitle: string;
  trailing: ReactNode;
  disabled?: boolean;
};

export const SettingItem = ({ className, title, subtitle, trailing, disabled }: SettingItemProps) => {
  return (
    <Flex justify={"between"} align={"center"} className={cn(className, "select-none", disabled ? "opacity-50" : "")}>
      <Flex direction={"column"} gap={"1"}>
        <div className="">{title}</div>
        {subtitle.length > 0 && <div className="text-xs opacity-50">{subtitle}</div>}
      </Flex>
      {trailing}
    </Flex>
  );
};
