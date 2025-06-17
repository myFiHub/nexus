import { CopyButton } from "../../../components/copyButton";

interface InfoCardProps {
  title: string;
  items: Array<{
    label: string;
    value: string | number | boolean;
    isMonospace?: boolean;
  }>;
}

const truncateAddress = (address: string, start = 6, end = 4) => {
  if (!address) return "";
  if (address.length <= start + end) return address;
  return `${address.slice(0, start)}...${address.slice(-end)}`;
};

export const InfoCard = ({ title, items }: InfoCardProps) => (
  <div className="bg-card p-4 rounded-lg">
    <h3 className="font-semibold mb-2 text-foreground">{title}</h3>
    <div className="text-sm">
      {items.map((item, index) => (
        <div key={index} className="mb-1 flex items-center">
          <span className="text-muted-foreground">{item.label}:</span>
          <div className="ml-2 flex items-center">
            <span
              className={`${
                item.isMonospace ? "font-mono" : ""
              } text-foreground`}
            >
              {typeof item.value === "boolean"
                ? item.value
                  ? "Yes"
                  : "No"
                : item.isMonospace
                ? truncateAddress(String(item.value))
                : item.value}
            </span>
            {item.isMonospace && <CopyButton text={String(item.value)} />}
          </div>
        </div>
      ))}
    </div>
  </div>
);
