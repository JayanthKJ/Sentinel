import random
import uuid
from datetime import datetime, timedelta, timezone
from typing import List
from models.event import Event

# IST timezone
IST = timezone(timedelta(hours=5, minutes=30))


class EventSimulator:
    """
    Generates realistic industrial monitoring events using
    causal failure chains and background noise simulation.
    """

    # Industrial causal event chains
    CAUSAL_CHAINS = {
        "cooling_system": {
            "title": "Cooling System Failure",
            "events": [
                {
                    "type": "fan_failure",
                    "msg": "Cooling fan FAN-{fan_id} speed drop detected",
                    "sev": "medium"
                },
                {
                    "type": "temperature_rising",
                    "msg": "Core temperature exceeding safe threshold in sector {sector}",
                    "sev": "high"
                },
                {
                    "type": "coolant_low",
                    "msg": "Coolant flow instability detected in loop {loop}",
                    "sev": "critical"
                }
            ]
        },

        "electrical_system": {
            "title": "Voltage Instability",
            "events": [
                {
                    "type": "voltage_spike",
                    "msg": "Transient voltage spike detected on grid G-{grid}",
                    "sev": "medium"
                },
                {
                    "type": "transformer_overload",
                    "msg": "Transformer TR-{transformer} thermal overload detected",
                    "sev": "high"
                },
                {
                    "type": "power_fluctuation",
                    "msg": "Substation power fluctuation detected in circuit C-{circuit}",
                    "sev": "critical"
                }
            ]
        },

        "pressure_system": {
            "title": "Pressure Anomaly",
            "events": [
                {
                    "type": "valve_malfunction",
                    "msg": "Relief valve VLV-{valve} actuation delay detected",
                    "sev": "medium"
                },
                {
                    "type": "pressure_drop",
                    "msg": "Rapid pressure drop detected in sector {sector}",
                    "sev": "high"
                },
                {
                    "type": "pipe_leak",
                    "msg": "Possible containment breach in line L-{line}",
                    "sev": "critical"
                }
            ]
        },

        "sensor_network": {
            "title": "Sensor Drift Detected",
            "events": [
                {
                    "type": "inconsistent_readings",
                    "msg": "Telemetry variance detected on sensor SEN-{sensor}",
                    "sev": "low"
                },
                {
                    "type": "calibration_failure",
                    "msg": "Sensor SEN-{sensor} failed automated calibration",
                    "sev": "medium"
                },
                {
                    "type": "sensor_timeout",
                    "msg": "Complete telemetry loss from sensor cluster CL-{cluster}",
                    "sev": "high"
                }
            ]
        },

        "mechanical_system": {
            "title": "Pump Degradation Risk",
            "events": [
                {
                    "type": "motor_vibration",
                    "msg": "Abnormal harmonic vibration detected in motor M-{motor}",
                    "sev": "low"
                },
                {
                    "type": "bearing_wear",
                    "msg": "Acoustic analysis indicates bearing wear in unit B-{bearing}",
                    "sev": "medium"
                },
                {
                    "type": "pump_degradation",
                    "msg": "Critical pump efficiency degradation detected in unit P-{pump}",
                    "sev": "high"
                }
            ]
        }
    }

    def __init__(self):
        self.events: List[Event] = []

    def _generate_dynamic_values(self):
        """Generate realistic industrial placeholder values."""
        return {
            "fan_id": f"{random.randint(1, 12):03d}",
            "sector": random.choice(["A", "B", "C", "D"]),
            "loop": random.randint(1, 5),
            "grid": random.randint(1, 4),
            "transformer": random.randint(1, 8),
            "circuit": random.randint(1, 6),
            "valve": random.randint(1, 12),
            "line": random.randint(1, 6),
            "sensor": random.randint(100, 999),
            "cluster": random.randint(1, 5),
            "motor": random.randint(1, 8),
            "bearing": random.randint(1, 16),
            "pump": random.randint(1, 6),
        }

    def generate_causal_chain(self, system: str = None) -> List[Event]:
        """
        Generate a realistic sequence of related events
        representing a developing industrial failure.
        """

        if system is None or system not in self.CAUSAL_CHAINS:
            system = random.choice(list(self.CAUSAL_CHAINS.keys()))

        chain_template = self.CAUSAL_CHAINS[system]["events"]

        batch = []

        base_time = datetime.now(IST) - timedelta(
            minutes=random.randint(2, 20)
        )

        # Partial vs full escalation
        chain_length = random.randint(2, len(chain_template))

        dynamic_values = self._generate_dynamic_values()

        for i in range(chain_length):

            step = chain_template[i]

            event_time = base_time + timedelta(
                seconds=i * random.randint(20, 90)
            )

            event = Event(
                event_id=f"evt-{uuid.uuid4().hex[:8]}",
                timestamp=event_time.isoformat(),
                severity=step["sev"],
                system=system,
                event_type=step["type"],
                message=step["msg"].format(**dynamic_values),
                status="active"
            )

            batch.append(event)
            self.events.append(event)

        return batch

    def generate_noise(self, count: int = 2) -> List[Event]:
        """
        Generate isolated low-priority noise events
        to simulate real monitoring environments.
        """

        batch = []

        systems = list(self.CAUSAL_CHAINS.keys())

        for _ in range(count):

            system = random.choice(systems)

            step = self.CAUSAL_CHAINS[system]["events"][0]

            dynamic_values = self._generate_dynamic_values()

            event = Event(
                event_id=f"evt-{uuid.uuid4().hex[:8]}",
                timestamp=datetime.now(IST).isoformat(),
                severity="low",
                system=system,
                event_type=step["type"],
                message=step["msg"].format(**dynamic_values) + " (isolated anomaly)",
                status="active"
            )

            batch.append(event)
            self.events.append(event)

        return batch

    def generate_event(self) -> Event:
        """
        Generate a single standalone event.
        Useful for debugging/testing.
        """

        return self.generate_noise(count=1)[0]

    def generate_simulation_batch(self, count: int = 2) -> List[Event]:
        """
        Generate multiple realistic causal chains
        along with environmental monitoring noise.
        """

        all_events = []

        for _ in range(count):
            all_events.extend(self.generate_causal_chain())

        # Add background noise
        all_events.extend(self.generate_noise(count=count * 2))

        return all_events

    def generate_related_events(self, system: str, count: int = 3) -> List[Event]:
        """
        Compatibility helper for existing API routes.
        """

        return self.generate_causal_chain(system=system)

    def get_all_events(self) -> List[Event]:
        """Return all generated events."""

        return self.events

    def clear_events(self):
        """Clear stored event history."""

        self.events = []