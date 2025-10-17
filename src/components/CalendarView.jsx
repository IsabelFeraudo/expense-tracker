import React, { useMemo } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import {
  parse,
  startOfWeek,
  getDay,
  format,
  addYears,
  subYears,
  startOfDay,
} from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useStore } from "../store";
import { computeDailyBalances } from "../utils/calcDailyBalances";

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

  // Determinar rango amplio para balances
  const getWideRange = useMemo(() => {
    if (transactions.length === 0) {
      const now = new Date();
      return {
        start: subYears(now, 1),
        end: addYears(now, 1),
      };
    }

    // Normalizamos cada fecha a local startOfDay
    const txDates = transactions.map((tx) =>
      startOfDay(parse(tx.date, "yyyy-MM-dd", new Date()))
    );
    const minTxDate = new Date(Math.min(...txDates));
    const maxTxDate = new Date(Math.max(...txDates));

    const start = subYears(minTxDate, 1);
    const end = addYears(maxTxDate, 1);

    return { start, end };
  }, [transactions]);

  // Calcular balances diarios acumulados
  const dailyBalances = useMemo(() => {
    const { start, end } = getWideRange;
    const normStart = startOfDay(start);
    const normEnd = startOfDay(end);
    return computeDailyBalances(transactions, {
      start: normStart,
      end: normEnd,
      startingBalance: 0,
    });
  }, [transactions, getWideRange]);

  // Crear eventos del calendario (cada día = balance acumulado)
  const events = useMemo(() => {
    return Object.entries(dailyBalances).map(([dateStr, balance]) => {
      // parse en local, no UTC
      const eventDate = parse(dateStr, "yyyy-MM-dd", new Date());
      return {
        title: `$${balance.toFixed(2)}`,
        start: startOfDay(eventDate),
        end: startOfDay(eventDate),
        allDay: true,
        balance,
        dateStr,
      };
    });
  }, [dailyBalances]);

  // Estilos para cada celda según balance
  const eventPropGetter = (event) => {
    let bgColor,
      textColor = "#5D4037";

    if (event.balance < 0) {
      bgColor = "#C2185B"; // fucsia casi rojo para negativos
      textColor = "#FFF8E1";
    } else if (event.balance < 100) {
      bgColor = "#E91E63"; // fucsia fuerte para montos menores a 100
      textColor = "#FFF8E1";
    } else if (event.balance >= 500) {
      bgColor = "#90CAF9"; // azul pastel para >= 500
    } else if (event.balance >= 300) {
      bgColor = "#A5D6A7"; // verde pastel para >300
    } else {
      bgColor = "#F8BBD0"; // rosa claro por defecto
    }

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

  const minDate = getWideRange.start;
  const maxDate = getWideRange.end;

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
          const dateStr = getNormalizedDateStr(event.start);
          onSelectTransaction(null, dateStr);
        }}
        onSelectSlot={({ start }) => {
          const dateStr = getNormalizedDateStr(start);
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
        Cumulative daily balances shown. Click a day to view transactions.
      </p>
    </div>
  );
}
