import * as React from "react";
import { cn } from "@/lib/utils";

interface MoneyInputProps extends Omit<React.ComponentProps<"input">, "type" | "onChange" | "value"> {
  value: number;
  onChange: (value: number) => void;
}

const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(value.toLocaleString('pt-BR'));

    React.useEffect(() => {
      setDisplayValue(value.toLocaleString('pt-BR'));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      // Remove all non-numeric characters
      const numericValue = inputValue.replace(/\D/g, '');
      
      if (numericValue === '') {
        onChange(0);
        setDisplayValue('0');
        return;
      }

      const parsedValue = parseInt(numericValue, 10);
      onChange(parsedValue);
      setDisplayValue(parsedValue.toLocaleString('pt-BR'));
    };

    return (
      <input
        type="text"
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]",
          className
        )}
        value={displayValue}
        onChange={handleChange}
        ref={ref}
        {...props}
      />
    );
  }
);

MoneyInput.displayName = "MoneyInput";

export { MoneyInput };