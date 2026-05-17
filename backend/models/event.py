from dataclasses import dataclass, asdict

@dataclass
class Event:
    """
    Represents a single monitoring event generated from
    industrial systems within Sentinel.
    """
    event_id: str
    timestamp: str

    # Severity levels:
    # low, medium, high, critical
    severity: str

    # Example:
    # cooling_system, electrical_system, pressure_system
    system: str

    # Example:
    # fan_failure, voltage_spike, pressure_drop
    event_type: str

    message: str

    # active, acknowledged, resolved
    status: str = "active"

    def to_dict(self):
        """Convert event object to JSON-serializable dictionary"""
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict):
        """Create Event object from dictionary"""
        return cls(**data)