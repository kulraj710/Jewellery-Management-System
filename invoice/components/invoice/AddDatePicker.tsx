import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

export function AddDatePicker({ selectedDate, setSelectedDate, showClearDate = false }: any) {
  const [open, setOpen] = useState(false); // To handle the popover state

  return (
    <div className="flex items-center space-x-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-[100%] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              setSelectedDate(date);
              setOpen(false); // Close the popover after date selection
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {(selectedDate && showClearDate) && (
        <Button variant="ghost" onClick={() => setSelectedDate(null)}>
          Clear Date
        </Button>
      )}
    </div>
  );
}
