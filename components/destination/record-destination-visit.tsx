"use client";

import { useEffect, useRef } from "react";
import { recordDestinationVisitAction } from "@/app/actions/destination-visit";

type Props = {
  destinationId: string;
};

export function RecordDestinationVisit({ destinationId }: Props) {
  const recorded = useRef(false);

  useEffect(() => {
    if (recorded.current) return;
    recorded.current = true;
    void recordDestinationVisitAction(destinationId);
  }, [destinationId]);

  return null;
}
