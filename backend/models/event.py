from dataclasses import dataclass, asdict
from datetime import datetime
from typing import Optional

@dataclass
class Event:
    """
    Represents a single monitoring event from an industrial system.
    Uses dataclass for simplicity - no ORM needed for MVP.
    """
    event_id: str
    timestamp: str
    severity: str  # "low", "medium", "high", "critical"
    system: str    # e.g., "cooling_system", "power_grid", "pressure_valve"
    event_type: str  # e.g., "temperature_alert", "fan_failure", "pressure_spike"
    message: str
    status: str = "active"  # "active", "acknowledged", "resolved"
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return asdict(self)
    
    @classmethod
    def from_dict(cls, data: dict):
        """Create Event instance from dictionary"""
        return cls(**data)