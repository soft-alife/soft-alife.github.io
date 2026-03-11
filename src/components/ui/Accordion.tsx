import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionItem {
  title: string;
  description: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full">
      {items.map((item, index) => (
        <div
          key={index}
          className="border-b border-[#E4E4E7]"
        >
          <button
            type="button"
            onClick={() => toggle(index)}
            className="w-full flex items-center justify-between py-4 text-left cursor-pointer"
            aria-expanded={openIndex === index}
          >
            <span className="text-[15px] font-semibold text-[#0A0A0A]">
              {item.title}
            </span>
            <ChevronDown
              size={16}
              className={`text-[#A1A1AA] shrink-0 ml-4 transition-transform duration-200 ${
                openIndex === index ? "rotate-180" : "rotate-0"
              }`}
            />
          </button>
          <div
            className={`overflow-hidden transition-all duration-200 ${
              openIndex === index ? "max-h-40 pb-4" : "max-h-0"
            }`}
          >
            <p className="text-[13px] text-[#71717A] leading-relaxed">
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
