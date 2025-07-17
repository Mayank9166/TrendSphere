import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function convertToRead(input)
{
    const dateObj = new Date(input);
    const options = {
        year : "numeric",
        month :"long",
        day:"numeric"
    }
    const readable = dateObj.toLocaleString("en-US",options
    );
    return readable;
}