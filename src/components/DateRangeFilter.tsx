"use client";

import { addDays, format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export function DateRangeFilter({
  initialStartDate,
  initialEndDate,
}: {
  initialStartDate?: string | null;
  initialEndDate?: string | null;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: initialStartDate ? new Date(initialStartDate) : undefined,
    to: initialEndDate ? new Date(initialEndDate) : undefined,
  });

  // Watch for complete range selection
  React.useEffect(() => {
    // We only trigger URL update when both dates are selected,
    // or when the user explicitly clears the selection (date is undefined).
    // To avoid firing on the first click (when only 'from' is selected), we check if 'to' is also selected.

    // Check if the current state differs from the URL parameters to avoid infinite loops
    const currentFromStr = date?.from ? format(date.from, "yyyy-MM-dd") : null;
    const currentToStr = date?.to ? format(date.to, "yyyy-MM-dd") : null;

    // Only proceed if a complete range is selected OR if it was completely cleared
    if ((date?.from && date?.to) || date === undefined) {
      if (currentFromStr !== initialStartDate || currentToStr !== initialEndDate) {
        const url = new URL(window.location.href);

        if (currentFromStr) {
          url.searchParams.set("startDate", currentFromStr);
        } else {
          url.searchParams.delete("startDate");
        }

        if (currentToStr) {
          url.searchParams.set("endDate", currentToStr);
        } else {
          url.searchParams.delete("endDate");
        }

        // Reset page to 1 if we are filtering, because the total number of items changes
        // Since we don't know the base path easily, we can just let it filter on the current page,
        // but wait, if they are on page 5 and apply a filter, they might get a 404.
        // We'll strip the page number and redirect to the base route.
        const pathParts = url.pathname.split("/").filter(Boolean);
        // if path ends with a number (page), remove it
        if (pathParts.length > 0 && !isNaN(Number(pathParts[pathParts.length - 1]))) {
          pathParts.pop();
          url.pathname = "/" + pathParts.join("/");
        }

        window.location.assign(url.toString());
      }
    }
  }, [date, initialStartDate, initialEndDate]);

  return (
    <Field className="w-full space-y-2">
      <div className="flex items-center justify-between">
        <FieldLabel htmlFor="date-picker-range">Rentang Tanggal</FieldLabel>
        {(initialStartDate || initialEndDate) && (
          <button
            type="button"
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete("startDate");
              url.searchParams.delete("endDate");

              // Reset pagination to page 1
              const pathParts = url.pathname.split("/").filter(Boolean);
              if (pathParts.length > 0 && !isNaN(Number(pathParts[pathParts.length - 1]))) {
                pathParts.pop();
                url.pathname = "/" + pathParts.join("/");
              }

              window.location.assign(url.toString());
            }}
            className="text-xs text-muted-foreground transition-colors hover:text-destructive"
          >
            Reset
          </button>
        )}
      </div>
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              id="date-picker-range"
              className="w-full justify-start bg-background px-2.5 font-normal"
            />
          }
        >
          <CalendarIcon data-icon="inline-start" className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "MMM dd, y")} - {format(date.to, "MMM dd, y")}
              </>
            ) : (
              format(date.from, "MMM dd, y")
            )
          ) : (
            <span>Pilih tanggal</span>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}
