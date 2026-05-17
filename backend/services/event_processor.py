from typing import List, Dict

from models.event import Event


class EventProcessor:
    """
    Processes and classifies industrial monitoring events.

    Responsibilities:
    - severity escalation
    - event filtering
    - grouping
    - preprocessing for incident detection
    """

    # Event types that should always escalate to CRITICAL
    CRITICAL_TYPES = [
        "coolant_low",
        "power_fluctuation",
        "pipe_leak",
        "pump_degradation"
    ]

    def __init__(self):

        # Stores processed events
        self.processed_events: List[Event] = []

    def process_event(self, event: Event) -> Event:
        """
        Process a single event and apply
        severity escalation rules.
        """

        # Escalate critical event types
        if (
            event.event_type in self.CRITICAL_TYPES
            and event.severity != "critical"
        ):
            event.severity = "critical"

        self.processed_events.append(event)

        return event

    def process_batch(self, events: List[Event]) -> List[Event]:
        """
        Process multiple events.
        """

        return [
            self.process_event(event)
            for event in events
        ]

    def filter_by_severity(self, severity: str) -> List[Event]:
        """
        Return events filtered by severity.
        """

        return [
            event for event in self.processed_events
            if event.severity == severity
        ]

    def filter_by_system(self, system: str) -> List[Event]:
        """
        Return events filtered by industrial subsystem.
        """

        return [
            event for event in self.processed_events
            if event.system == system
        ]

    def get_active_events(self) -> List[Event]:
        """
        Return unresolved/active events only.
        """

        return [
            event for event in self.processed_events
            if event.status == "active"
        ]

    def group_by_system(self) -> Dict[str, List[Event]]:
        """
        Group events by industrial subsystem.

        Returns:
        {
            system_name: [events]
        }
        """

        grouped = {}

        for event in self.processed_events:

            if event.system not in grouped:
                grouped[event.system] = []

            grouped[event.system].append(event)

        return grouped

    def get_all_events(self) -> List[Event]:
        """
        Return all processed events.
        """

        return self.processed_events

    def clear_events(self):
        """
        Reset processed event history.
        """

        self.processed_events = []