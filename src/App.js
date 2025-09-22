import React, { useState } from "react";
import TransactionForm from "./components/TransactionForm";
import CalendarView from "./components/CalendarView";
import TransactionList from "./components/TransactionList";

export default function App() {
  // Track selected day (string 'yyyy-MM-dd') or null
  const [selectedDate, setSelectedDate] = useState(null);

  // Track current month displayed in calendar (Date object)
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // When user clicks a day in calendar
  const handleSelectDay = (e, dateStr) => {
    setSelectedDate(dateStr);
  };

  // When user navigates month in calendar
  const handleNavigate = (date) => {
    setCurrentMonth(date);
    // optional: clear selected day when month changes
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen p-6 max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
      {/* Left column */}
      <div className="flex-1">
        <header className="mb-8 text-center">
          <h1 className="text-darkPink text-4xl font-bold mb-2">
            Girly Pop Budget
          </h1>
          <p className="text-chocolate text-lg italic">
            Track your incomes and expenses with style!
          </p>
        </header>

        <TransactionForm />

        <CalendarView
          onSelectTransaction={handleSelectDay}
          onNavigate={handleNavigate}
          currentMonth={currentMonth}
        />
      </div>

      {/* Right column */}
      <div className="w-full md:w-96">
        {selectedDate && (
          <TransactionList
            selectedDate={selectedDate}
            currentMonth={currentMonth}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </div>
    </div>
  );
}
