from typing import List, Dict
from models.event import Event

class EventProcessor:
    """
    Processes and classifies events.
    Adds intelligence layer to raw monitoring data.
    """
    
    # Define priority rules based on severity and event type
    PRIORITY_RULES = {
        "critical": "critical",
        "high": "high",
        "medium": "medium",
        "low": "low"
    }
    
    # Critical event types that should be escalated
    CRITICAL_TYPES = [
        "fan_failure",
        "generator_failure",
        "valve_stuck",
        "power_surge"
    ]
    
    def __init__(self):
        self.processed_events: List[Event] = []
    
    def process_event(self, event: Event) -> Event:
        """
        Process a single event - add classification, adjust priority if needed.
        """
        # Escalate priority if event type is critical
        if event.event_type in self.CRITICAL_TYPES and event.severity != "critical":
            event.severity = "critical"
        
        self.processed_events.append(event)
        return event
    
    def process_batch(self, events: List[Event]) -> List[Event]:
        """Process multiple events"""
        processed = []
        for event in events:
            processed.append(self.process_event(event))
        return processed
    
    def filter_by_severity(self, severity: str) -> List[Event]:
        """Get events filtered by severity level"""
        return [e for e in self.processed_events if e.severity == severity]
    
    def filter_by_system(self, system: str) -> List[Event]:
        """Get events filtered by system"""
        return [e for e in self.processed_events if e.system == system]
    
    def get_active_events(self) -> List[Event]:
        """Get only active (unresolved) events"""
        return [e for e in self.processed_events if e.status == "active"]
    
    def group_by_system(self) -> Dict[str, List[Event]]:
        """
        Group events by system for easier incident detection.
        Returns: {system_name: [events]}
        """
        grouped = {}
        for event in self.processed_events:
            if event.system not in grouped:
                grouped[event.system] = []
            grouped[event.system].append(event)
        return grouped
    
    def get_all_events(self) -> List[Event]:
        """Return all processed events"""
        return self.processed_events
    
    def clear_events(self):
        """Clear all processed events"""
        self.processed_events = []