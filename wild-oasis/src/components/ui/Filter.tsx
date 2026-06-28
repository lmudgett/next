import { ReactNode } from "react";

type FilterProps = {
  name: string;
  label: string;
  className?: string;
  children: ReactNode;
};

type FilterOptionsProps = {
  name: string;
  value: string;
};

const Filter: React.FC<FilterProps> & {
  Option: React.FC<FilterOptionsProps>;
} = ({ name, label, className, children }) => {
  return (
    <div className={className}>
      <label htmlFor={name}>{label}</label>
      <select>{children}</select>
    </div>
  );
};

const FilterOption: React.FC<FilterOptionsProps> = ({ name, value }) => (
  <option value={value}>{name}</option>
);

Filter.Option = FilterOption;

export default Filter;
