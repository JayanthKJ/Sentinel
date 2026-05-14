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
    priority: str  # "low", "medium", "high", "critical"
    related_events: List[str] = field(default_factory=list)  # List of event_ids
    possible_cause: str = ""
    recommendation: str = ""
    status: str = "open"  # "open", "investigating", "resolved"
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return asdict(self)
    
    def add_event(self, event_id: str):
        """Add a related event to this incident"""
        if event_id not in self.related_events:
            self.related_events.append(event_id)
    
    @classmethod
    def from_dict(cls, data: dict):
        """Create Incident instance from dictionary"""
        return cls(**data)