import React, { useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  parse,
  startOfWeek,
  getDay,
  format,
  addYears,
  subYears,
  eachDayOfInterval,
  isBefore,
  isAfter,
  startOfDay, // Added for normalization
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useStore } from "../store";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 0 }),
  getDay,
  locales,
});

export default function CalendarView({
  onSelectTransaction,
  onNavigate,
  currentMonth,
}) {
  const transactions = useStore((state) => state.transactions);

  // Determine a wide range for balance calculation (2 years buffer around transactions)
  const getWideRange = useMemo(() => {
    if (transactions.length === 0) {
      const now = new Date();
      return {
        start: subYears(now, 1),
        end: addYears(now, 1),
      };
    }

    // Find min and max transaction dates (normalize to start of day)
    const txDates = transactions.map((tx) =>
      startOfDay(parse(tx.date, "yyyy-MM-dd", new Date()))
    );
    const minTxDate = new Date(Math.min(...txDates));
    const maxTxDate = new Date(Math.max(...txDates));

    const start = subYears(minTxDate, 1);
    const end = addYears(maxTxDate, 1);

    return { start, end };
  }, [transactions]);

  // Calculate daily balances for the wide range (cumulative up to each day)
  const dailyBalances = useMemo(() => {
    const { start, end } = getWideRange;
    const days = eachDayOfInterval({ start, end });

    // Sort transactions by date ascending (normalize dates for comparison)
    const sortedTx = [...transactions]
      .map((tx) => ({
        ...tx,
        normalizedDate: startOfDay(parse(tx.date, "yyyy-MM-dd", new Date())),
      }))
      .sort((a, b) => a.normalizedDate - b.normalizedDate);

    // Accumulate balance day by day
    let balance = 0;
    const balancesMap = {};
    let txIndex = 0;

    days.forEach((day) => {
      const normalizedDay = startOfDay(day); // Normalize to start of day
      const dayStr = format(normalizedDay, "yyyy-MM-dd"); // Consistent string format

      // Process all transactions up to and including this day
      while (
        txIndex < sortedTx.length &&
        sortedTx[txIndex].normalizedDate <= normalizedDay
      ) {
        const tx = sortedTx[txIndex];
        balance += tx.type === "income" ? tx.amount : -tx.amount;
        txIndex++;
      }

      balancesMap[dayStr] = balance;
    });

    return balancesMap;
  }, [transactions, getWideRange]);

  // Create events for react-big-calendar (one per day in the range)
  const events = useMemo(() => {
    return Object.entries(dailyBalances).map(([dateStr, balance]) => ({
      title: `$${balance.toFixed(2)}`,
      start: startOfDay(new Date(dateStr)), // Normalize event start
      end: startOfDay(new Date(dateStr)), // Normalize event end
      allDay: true,
      balance,
      dateStr,
    }));
  }, [dailyBalances]);

  // Custom event styling
  const eventPropGetter = (event) => {
    const bgColor = event.balance >= 0 ? "#F8BBD0" : "#F06292";
    const textColor = event.balance >= 0 ? "#5D4037" : "#FFF8E1";
    return {
      style: {
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: "0.5rem",
        border: "none",
        padding: "0.25rem 0.5rem",
        fontWeight: "600",
        fontSize: "0.8rem",
        textAlign: "center",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      },
    };
  };

  // Restrict navigation to the wide range
  const minDate = getWideRange.start;
  const maxDate = getWideRange.end;

  // Helper to get normalized date string from a calendar date
  const getNormalizedDateStr = (date) => {
    const normalized = startOfDay(date);
    return format(normalized, "yyyy-MM-dd");
  };

  return (
    <div className="bg-cream rounded-2xl p-4 shadow-md max-w-5xl mx-auto mb-6">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={["month"]}
        date={currentMonth || new Date()}
        onNavigate={onNavigate}
        min={minDate}
        max={maxDate}
        eventPropGetter={eventPropGetter}
        onSelectEvent={(event) => {
          // Normalize the event's start date before passing
          const dateStr = getNormalizedDateStr(event.start);
          console.log(
            "Selected event date:",
            event.start,
            "-> Normalized:",
            dateStr
          ); // Debug log
          onSelectTransaction(null, dateStr);
        }}
        onSelectSlot={({ start }) => {
          // Normalize the slot's start date before passing
          const dateStr = getNormalizedDateStr(start);
          console.log("Selected slot date:", start, "-> Normalized:", dateStr); // Debug log
          onSelectTransaction(null, dateStr);
        }}
        selectable
        dayPropGetter={(date) => {
          const today = startOfDay(new Date());
          const normalizedDate = startOfDay(date);
          if (
            format(today, "yyyy-MM-dd") === format(normalizedDate, "yyyy-MM-dd")
          ) {
            return {
              style: {
                backgroundColor: "#F06292",
                opacity: 0.3,
                color: "#FFF8E1",
                borderRadius: "0.5rem",
              },
            };
          }
          return {};
        }}
      />
      <p className="mt-2 text-center text-chocolate text-sm italic">
        Balances shown cumulatively for each day. Click a day to view
        transactions.
      </p>
    </div>
  );
}
