from dataclasses import dataclass, asdict, field
from typing import List

@dataclass
class Incident:
    """
    Represents a grouped incident containing multiple related events.
    This is the intelligence layer that combines alerts into meaningful insights.
    """
    incident_id: str
    incident_title: str

    # low, medium, high, critical
    priority: str

    # AI confidence score (50–95)
    confidence: int = 50

    # List of related event IDs
    related_events: List[str] = field(default_factory=list)

    possible_cause: str = ""
    recommendation: str = ""

    # open, investigating, resolved
    status: str = "open"

    def to_dict(self):
        """Convert incident object to JSON-serializable dictionary"""
        return asdict(self)

    def add_event(self, event_id: str):
        """Attach related event to incident"""
        if event_id not in self.related_events:
            self.related_events.append(event_id)

    @classmethod
    def from_dict(cls, data: dict):
        """Create Incident object from dictionary"""
        return cls(**data)