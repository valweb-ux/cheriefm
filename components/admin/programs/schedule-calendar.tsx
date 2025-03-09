import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ScheduleCalendar({ events = [], onEventSelect = () => {}, onAddEvent = () => {} }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Розклад програм</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="p-4 border rounded-md bg-muted">
          <p className="text-sm text-muted-foreground mb-4">
            Календар розкладу тимчасово недоступний.
          </p>
          <Button onClick={() => onAddEvent(new Date())}>
            Додати нову програму
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
