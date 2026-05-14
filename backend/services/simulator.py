import random
import uuid
from datetime import datetime, timedelta
from typing import List
from models.event import Event

class EventSimulator:
    """
    Generates realistic mock industrial monitoring events.
    Simulates various failure scenarios for demo purposes.
    """
    
    # Define realistic event scenarios
    EVENT_TEMPLATES = {
        "cooling_system": [
            {
                "event_type": "temperature_rising",
                "message": "Temperature exceeding normal range in sector {sector}",
                "severity": "medium"
            },
            {
                "event_type": "fan_failure",
                "message": "Cooling fan {fan_id} has stopped responding",
                "severity": "high"
            },
            {
                "event_type": "coolant_low",
                "message": "Coolant level below threshold",
                "severity": "high"
            }
        ],
        "power_grid": [
            {
                "event_type": "voltage_fluctuation",
                "message": "Voltage instability detected on circuit {circuit}",
                "severity": "medium"
            },
            {
                "event_type": "power_surge",
                "message": "Power surge detected - {voltage}V",
                "severity": "critical"
            },
            {
                "event_type": "generator_failure",
                "message": "Backup generator failed to start",
                "severity": "critical"
            }
        ],
        "pressure_system": [
            {
                "event_type": "pressure_spike",
                "message": "Pressure spike detected: {pressure} PSI",
                "severity": "high"
            },
            {
                "event_type": "valve_stuck",
                "message": "Relief valve {valve_id} not responding",
                "severity": "critical"
            },
            {
                "event_type": "pressure_dropping",
                "message": "Rapid pressure drop in line {line}",
                "severity": "medium"
            }
        ],
        "network": [
            {
                "event_type": "connection_lost",
                "message": "Lost connection to sensor {sensor_id}",
                "severity": "medium"
            },
            {
                "event_type": "latency_high",
                "message": "Network latency exceeding {latency}ms",
                "severity": "low"
            }
        ]
    }
    
    def __init__(self):
        self.events: List[Event] = []
    
    def generate_event(self, system: str = None) -> Event:
        """Generate a single random event"""
        if system is None:
            system = random.choice(list(self.EVENT_TEMPLATES.keys()))
        
        template = random.choice(self.EVENT_TEMPLATES[system])
        
        # Generate dynamic values
        message = template["message"].format(
            sector=random.choice(["A", "B", "C"]),
            fan_id=f"FAN-{random.randint(1, 10):03d}",
            circuit=f"C{random.randint(1, 5)}",
            voltage=random.randint(240, 280),
            pressure=random.randint(100, 200),
            valve_id=f"VLV-{random.randint(1, 8):02d}",
            line=random.randint(1, 4),
            sensor_id=f"SEN-{random.randint(100, 999)}",
            latency=random.randint(500, 2000)
        )
        
        event = Event(
            event_id=str(uuid.uuid4())[:8],
            timestamp=datetime.now().isoformat(),
            severity=template["severity"],
            system=system,
            event_type=template["event_type"],
            message=message,
            status="active"
        )
        
        self.events.append(event)
        return event
    
    def generate_batch(self, count: int = 10) -> List[Event]:
        """Generate multiple events at once"""
        batch = []
        for _ in range(count):
            event = self.generate_event()
            batch.append(event)
        return batch
    
    def generate_related_events(self, system: str, count: int = 3) -> List[Event]:
        """
        Generate related events from the same system.
        Useful for creating incident scenarios.
        """
        batch = []
        base_time = datetime.now()
        
        for i in range(count):
            event = self.generate_event(system=system)
            # Stagger timestamps slightly
            event.timestamp = (base_time + timedelta(seconds=i*30)).isoformat()
            batch.append(event)
        
        return batch
    
    def get_all_events(self) -> List[Event]:
        """Return all generated events"""
        return self.events
    
    def clear_events(self):
        """Clear all stored events"""
        self.events = []