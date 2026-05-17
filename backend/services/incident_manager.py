import uuid
from typing import List, Dict
from datetime import datetime

from models.event import Event
from models.incident import Incident


class IncidentManager:
    """
    Intelligence layer responsible for:
    - grouping related events
    - detecting incidents
    - calculating confidence
    - generating operational insights
    """

    # Incident detection and response rules
    INCIDENT_RULES = {

        "cooling_system": {
            "title": "Cooling System Failure",
            "cause": "Primary coolant pump degradation or radiator fan instability.",
            "recommendation": (
                "Inspect coolant circulation loop and verify thermal regulation subsystem."
            ),
            "time_window": 600
        },

        "electrical_system": {
            "title": "Voltage Instability",
            "cause": "Grid fluctuation causing transformer thermal overload.",
            "recommendation": (
                "Route power through backup substation and inspect surge protection systems."
            ),
            "time_window": 600
        },

        "pressure_system": {
            "title": "Pressure Anomaly",
            "cause": "Mainline valve malfunction or containment breach suspected.",
            "recommendation": (
                "Initiate emergency depressurization and inspect valve assemblies."
            ),
            "time_window": 600
        },

        "sensor_network": {
            "title": "Sensor Drift Detected",
            "cause": "Telemetry interference or sensor calibration degradation.",
            "recommendation": (
                "Run remote diagnostics and schedule physical recalibration."
            ),
            "time_window": 900
        },

        "mechanical_system": {
            "title": "Pump Degradation Risk",
            "cause": "Bearing wear causing abnormal vibration and efficiency loss.",
            "recommendation": (
                "Pause motor operation and perform vibration and lubrication analysis."
            ),
            "time_window": 900
        }
    }

    # Prevent infinite incident accumulation
    MAX_INCIDENT_HISTORY = 50

    def __init__(self):

        # All active/stored incidents
        self.incidents: List[Incident] = []

        # Mapping:
        # event_id -> incident_id
        self.event_to_incident_map: Dict[str, str] = {}

        # Store raw events for recalculation
        self.raw_events: List[Event] = []

        # Dashboard metrics
        self.total_events_processed = 0

    def log_processed_events(self, count: int):
        """Track total events processed."""

        self.total_events_processed += count

    def calculate_confidence(self, events: List[Event]) -> int:
        """
        Calculate realistic AI confidence score (50–95)
        based on:
        - event count
        - severity
        - clustering density
        """

        if not events:
            return 50

        base_score = 45

        # More related events = stronger confidence
        event_bonus = min(30, len(events) * 8)

        severity_weights = {
            "critical": 20,
            "high": 12,
            "medium": 6,
            "low": 2
        }

        max_severity = max(
            [severity_weights.get(event.severity, 0) for event in events]
        )

        raw_score = base_score + event_bonus + max_severity

        return max(50, min(95, raw_score))

    def detect_incidents(self, events: List[Event]) -> List[Incident]:
        """
        Main intelligence pipeline.

        Detects clusters of related events
        and converts them into actionable incidents.
        """

        # Store raw events for future recalculation
        self.raw_events.extend(events)

        # Group events by industrial subsystem
        system_groups = self._group_events_by_system(events)

        new_incidents = []

        for system, system_events in system_groups.items():

            if system not in self.INCIDENT_RULES:
                continue

            clustered_events = self._find_time_clusters(
                system_events,
                self.INCIDENT_RULES[system]["time_window"]
            )

            for cluster in clustered_events:

                # Minimum threshold to qualify as incident
                if len(cluster) >= 2:

                    incident = self._create_incident(system, cluster)

                    if incident and incident not in new_incidents:
                        new_incidents.append(incident)

        return new_incidents

    def _group_events_by_system(
        self,
        events: List[Event]
    ) -> Dict[str, List[Event]]:
        """
        Group incoming events by system category.
        """

        grouped = {}

        for event in events:

            if event.system not in grouped:
                grouped[event.system] = []

            grouped[event.system].append(event)

        return grouped

    def _find_time_clusters(
        self,
        events: List[Event],
        time_window: int
    ) -> List[List[Event]]:
        """
        Detect clusters of events occurring
        within a configurable time window.
        """

        if not events:
            return []

        sorted_events = sorted(
            events,
            key=lambda e: datetime.fromisoformat(e.timestamp)
        )

        clusters = []
        current_cluster = [sorted_events[0]]

        for event in sorted_events[1:]:

            cluster_start = datetime.fromisoformat(
                current_cluster[0].timestamp
            )

            event_time = datetime.fromisoformat(event.timestamp)

            if (
                event_time - cluster_start
            ).total_seconds() <= time_window:

                current_cluster.append(event)

            else:

                if len(current_cluster) >= 2:
                    clusters.append(current_cluster)

                current_cluster = [event]

        if len(current_cluster) >= 2:
            clusters.append(current_cluster)

        return clusters

    def _create_incident(
        self,
        system: str,
        events: List[Event]
    ) -> Incident:
        """
        Create or update incident using clustered events.
        """

        existing_incident_id = None

        # Check whether cluster already belongs to incident
        for event in events:

            if event.event_id in self.event_to_incident_map:
                existing_incident_id = self.event_to_incident_map[event.event_id]
                break

        # Update existing incident
        if existing_incident_id:

            incident = next(
                (
                    i for i in self.incidents
                    if i.incident_id == existing_incident_id
                ),
                None
            )

            if incident:

                new_events_added = False

                for event in events:

                    if event.event_id not in incident.related_events:

                        incident.add_event(event.event_id)

                        self.event_to_incident_map[event.event_id] = (
                            incident.incident_id
                        )

                        new_events_added = True

                # Recalculate incident intelligence
                if new_events_added:

                    all_incident_events = [
                        e for e in self.raw_events
                        if e.event_id in incident.related_events
                    ]

                    incident.confidence = self.calculate_confidence(
                        all_incident_events
                    )

                    incident.priority = self._calculate_priority(
                        all_incident_events
                    )

                    rule = self.INCIDENT_RULES[system]

                    incident.incident_title = (
                        f"{rule['title']} - {incident.priority.upper()}"
                    )

                return incident

        # Create new incident
        rule = self.INCIDENT_RULES[system]

        priority = self._calculate_priority(events)

        confidence = self.calculate_confidence(events)

        incident = Incident(
            incident_id=str(uuid.uuid4())[:8],

            incident_title=(
                f"{rule['title']} - {priority.upper()}"
            ),

            priority=priority,

            confidence=confidence,

            related_events=[
                event.event_id for event in events
            ],

            possible_cause=rule["cause"],

            recommendation=rule["recommendation"],

            status="open"
        )

        self.incidents.append(incident)

        self._prune_incidents()

        # Map events to incident
        for event in events:
            self.event_to_incident_map[event.event_id] = (
                incident.incident_id
            )

        return incident

    def _prune_incidents(self):
        """
        Keep incident history bounded
        to avoid memory growth.
        """

        if len(self.incidents) <= self.MAX_INCIDENT_HISTORY:
            return

        stale_incidents = self.incidents[:-self.MAX_INCIDENT_HISTORY]

        stale_ids = {
            incident.incident_id
            for incident in stale_incidents
        }

        self.incidents = self.incidents[-self.MAX_INCIDENT_HISTORY:]

        self.event_to_incident_map = {
            event_id: incident_id
            for event_id, incident_id
            in self.event_to_incident_map.items()
            if incident_id not in stale_ids
        }

    def _calculate_priority(self, events: List[Event]) -> str:
        """
        Determine incident priority based on
        highest severity event.
        """

        severity_order = {
            "critical": 4,
            "high": 3,
            "medium": 2,
            "low": 1
        }

        max_severity = "low"
        max_value = 0

        for event in events:

            value = severity_order.get(event.severity, 0)

            if value > max_value:
                max_value = value
                max_severity = event.severity

        return max_severity

    def get_dashboard_metrics(self) -> dict:
        """
        Generate intelligent dashboard metrics.
        """

        total_incidents = len(self.incidents)

        critical_incidents = sum(
            1 for incident in self.incidents
            if incident.priority == "critical"
        )

        avg_confidence = 0

        if total_incidents > 0:

            avg_confidence = (
                sum(
                    incident.confidence
                    for incident in self.incidents
                ) / total_incidents
            )

        noise_reduction = 100.0

        if self.total_events_processed > 0:

            noise_reduction = (
                (
                    self.total_events_processed
                    - total_incidents
                ) / self.total_events_processed
            ) * 100

        return {

            "events_processed":
                self.total_events_processed,

            "incidents_detected":
                total_incidents,

            "critical_incidents":
                critical_incidents,

            "noise_reduction":
                round(noise_reduction, 2),

            "avg_confidence":
                round(avg_confidence, 1)
        }

    def get_all_incidents(self) -> List[Incident]:
        """Return all incidents."""

        return self.incidents

    def get_open_incidents(self) -> List[Incident]:
        """Return only open incidents."""

        return [
            incident for incident in self.incidents
            if incident.status == "open"
        ]

    def get_incident_by_id(self, incident_id: str) -> Incident:
        """Fetch specific incident by ID."""

        return next(
            (
                incident for incident in self.incidents
                if incident.incident_id == incident_id
            ),
            None
        )

    def clear_incidents(self):
        """Reset all incident data."""

        self.incidents = []
        self.event_to_incident_map = {}
        self.raw_events = []
        self.total_events_processed = 0